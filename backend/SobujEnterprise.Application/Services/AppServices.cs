using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SobujEnterprise.Application.DTOs;
using SobujEnterprise.Application.Interfaces;
using SobujEnterprise.Domain.Entities;
using SobujEnterprise.Infrastructure.Authentication;
using SobujEnterprise.Infrastructure.Hubs;
using SobujEnterprise.Infrastructure.Persistence;

namespace SobujEnterprise.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(AppDbContext context, IJwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (existingUser != null)
            {
                throw new InvalidOperationException("User with this email already exists.");
            }

            // Public registration must never be able to grant administrative privileges.
            const string targetRoleName = "Customer";
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == targetRoleName)
                ?? throw new InvalidOperationException($"Role '{targetRoleName}' does not exist.");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email.ToLower(),
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                PhoneNumber = dto.PhoneNumber,
                RoleId = role.Id
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtTokenGenerator.GenerateToken(user, role.RoleName, out var expiresAt);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = role.RoleName,
                Token = token,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            var roleName = user.Role?.RoleName ?? "Customer";
            var token = _jwtTokenGenerator.GenerateToken(user, roleName, out var expiresAt);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = roleName,
                Token = token,
                ExpiresAt = expiresAt
            };
        }
    }

    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Product>> GetProductsAsync(ProductFilterQuery query)
        {
            var q = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Variants)
                .Include(p => p.FilterValues)
                .AsQueryable();

            if (query.CategoryId.HasValue)
                q = q.Where(p => p.CategoryId == query.CategoryId.Value);

            if (query.BrandId.HasValue)
                q = q.Where(p => p.BrandId == query.BrandId.Value);

            if (query.MinPrice.HasValue)
                q = q.Where(p => (p.DiscountPrice ?? p.Price) >= query.MinPrice.Value);

            if (query.MaxPrice.HasValue)
                q = q.Where(p => (p.DiscountPrice ?? p.Price) <= query.MaxPrice.Value);

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.Trim().ToLower();
                q = q.Where(p => p.Title.ToLower().Contains(s) ||
                                 p.SKU.ToLower().Contains(s) ||
                                 (p.Tags != null && p.Tags.ToLower().Contains(s)));
            }

            if (!string.IsNullOrWhiteSpace(query.FilterValueIds))
            {
                var valIds = query.FilterValueIds.Split(',')
                    .Select(id => int.TryParse(id.Trim(), out var parsed) ? parsed : 0)
                    .Where(id => id > 0)
                    .ToList();

                if (valIds.Any())
                {
                    q = q.Where(p => p.FilterValues.Any(fv => valIds.Contains(fv.FilterAttributeValueId)));
                }
            }

            q = query.SortBy switch
            {
                "price_asc" => q.OrderBy(p => p.DiscountPrice ?? p.Price),
                "price_desc" => q.OrderByDescending(p => p.DiscountPrice ?? p.Price),
                "rating" => q.OrderByDescending(p => p.Rating),
                "popular" => q.OrderByDescending(p => p.IsBestSeller),
                _ => q.OrderByDescending(p => p.CreatedAt)
            };

            var totalItems = await q.CountAsync();
            var items = await q.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize).ToListAsync();

            return new PagedResult<Product>
            {
                TotalItems = totalItems,
                Page = query.Page,
                PageSize = query.PageSize,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                Items = items
            };
        }

        public async Task<Product?> GetProductBySlugAsync(string slug)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.GalleryImages)
                .Include(p => p.Variants)
                .Include(p => p.FilterValues)
                    .ThenInclude(fv => fv.FilterAttributeValue)
                        .ThenInclude(fav => fav!.FilterAttribute)
                .FirstOrDefaultAsync(p => p.Slug == slug);
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.GalleryImages)
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> UpdateProductAsync(int id, Product product)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return false;

            existing.Title = product.Title;
            existing.Slug = product.Slug;
            existing.SKU = product.SKU;
            existing.ShortDescription = product.ShortDescription;
            existing.Description = product.Description;
            existing.Price = product.Price;
            existing.DiscountPrice = product.DiscountPrice;
            existing.WholesaleTiersJson = product.WholesaleTiersJson;
            existing.StockQuantity = product.StockQuantity;
            existing.CategoryId = product.CategoryId;
            existing.BrandId = product.BrandId;
            existing.PrimaryImageUrl = product.PrimaryImageUrl;
            existing.IsFeatured = product.IsFeatured;
            existing.IsNewArrival = product.IsNewArrival;
            existing.IsBestSeller = product.IsBestSeller;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class WhatsAppService : IWhatsAppService
    {
        private readonly AppDbContext _context;

        public WhatsAppService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerateWhatsAppOrderUrlAsync(Order order, string storePhoneNumber = "8801827801872")
        {
            var template = await _context.WhatsAppTemplates
                .FirstOrDefaultAsync(t => t.TemplateType == order.OrderType)
                ?? await _context.WhatsAppTemplates.FirstOrDefaultAsync(t => t.IsDefault);

            string messageFormat = template?.MessageFormat ??
                "Hello Sobuj Enterprise, I placed Order #{OrderId}. Total: ৳{TotalAmount}. Please confirm!";

            var itemsList = string.Join("\n", order.Items.Select(i =>
                $"• {i.ProductTitle} {(string.IsNullOrEmpty(i.VariantName) ? "" : $"({i.VariantName})")} × {i.Quantity} = ৳{i.TotalPrice:F0}"));

            var text = messageFormat
                .Replace("{OrderId}", order.OrderNumber)
                .Replace("{CustomerName}", order.CustomerName)
                .Replace("{CustomerPhone}", order.CustomerPhone)
                .Replace("{Address}", order.DeliveryAddress)
                .Replace("{City}", order.City)
                .Replace("{TotalAmount}", order.TotalAmount.ToString("N0"))
                .Replace("{SubTotal}", order.SubTotal.ToString("N0"))
                .Replace("{DeliveryFee}", order.DeliveryFee.ToString("N0"))
                .Replace("{PaymentMethod}", order.PaymentMethod)
                .Replace("{ItemsList}", itemsList)
                .Replace("{Note}", string.IsNullOrWhiteSpace(order.CustomerNote) ? "None" : order.CustomerNote);

            var encodedText = HttpUtility.UrlEncode(text);
            return $"https://wa.me/{storePhoneNumber}?text={encodedText}";
        }
    }

    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IWhatsAppService _whatsAppService;
        private readonly IHubContext<OrderNotificationHub> _hubContext;

        public OrderService(AppDbContext context, IWhatsAppService whatsAppService, IHubContext<OrderNotificationHub> hubContext)
        {
            _context = context;
            _whatsAppService = whatsAppService;
            _hubContext = hubContext;
        }

        public async Task<OrderResponseDto> CreateOrderAsync(CreateOrderDto dto, int? userId = null)
        {
            var orderNumber = $"SE-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

            var order = new Order
            {
                OrderNumber = orderNumber,
                UserId = userId,
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                CustomerEmail = dto.CustomerEmail,
                DeliveryAddress = dto.DeliveryAddress,
                City = dto.City ?? "Dhaka",
                Area = dto.Area,
                DeliveryFee = dto.City?.Equals("Bogura", StringComparison.OrdinalIgnoreCase) == true
                    ? 50.00m
                    : dto.City?.Equals("Dhaka", StringComparison.OrdinalIgnoreCase) == true
                        ? 100.00m
                        : 120.00m,
                PaymentMethod = dto.PaymentMethod ?? "COD",
                OrderType = dto.OrderType ?? "Standard_COD",
                CustomerNote = dto.CustomerNote,
                OrderStatus = "Pending",
                PaymentStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            decimal subTotal = 0;
            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    throw new InvalidOperationException($"Product {item.ProductId} was not found.");
                }

                if (product.StockQuantity < item.Quantity)
                {
                    throw new InvalidOperationException($"Only {product.StockQuantity} unit(s) of '{product.Title}' are available.");
                }

                decimal unitPrice = GetWholesaleUnitPrice(product, item.Quantity);
                decimal lineTotal = unitPrice * item.Quantity;
                subTotal += lineTotal;

                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductTitle = product.Title,
                    ProductSKU = product.SKU,
                    VariantName = item.VariantName,
                    UnitPrice = unitPrice,
                    Quantity = item.Quantity,
                    TotalPrice = lineTotal,
                    CreatedAt = DateTime.UtcNow
                });

                product.StockQuantity -= item.Quantity;
            }

            order.SubTotal = subTotal;
            order.TotalAmount = subTotal + order.DeliveryFee;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var whatsAppUrl = await _whatsAppService.GenerateWhatsAppOrderUrlAsync(order);

            // Notify admin via SignalR Hub
            await _hubContext.Clients.All.SendAsync("ReceiveNewOrderNotification", new
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                CustomerName = order.CustomerName,
                TotalAmount = order.TotalAmount,
                ItemsCount = order.Items.Count,
                CreatedAt = order.CreatedAt
            });

            return new OrderResponseDto
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                SubTotal = order.SubTotal,
                DeliveryFee = order.DeliveryFee,
                TotalAmount = order.TotalAmount,
                WhatsAppOrderUrl = whatsAppUrl
            };
        }

        private static decimal GetWholesaleUnitPrice(Product product, int quantity)
        {
            var retailPrice = product.DiscountPrice ?? product.Price;
            if (string.IsNullOrWhiteSpace(product.WholesaleTiersJson)) return retailPrice;
            try
            {
                var tiers = JsonSerializer.Deserialize<List<WholesaleTier>>(product.WholesaleTiersJson) ?? new();
                return tiers.Where(t => t.MinQuantity > 0 && t.MinQuantity <= quantity && t.UnitPrice > 0)
                    .OrderByDescending(t => t.MinQuantity).Select(t => t.UnitPrice).FirstOrDefault(retailPrice);
            }
            catch (JsonException) { return retailPrice; }
        }

        private sealed class WholesaleTier
        {
            public int MinQuantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        public async Task<List<Order>> GetOrdersAsync(string? status = null, int? userId = null)
        {
            var query = _context.Orders.Include(o => o.Items).AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(o => o.UserId == userId.Value);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(o => o.OrderStatus == status);
            }

            return await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id, int? userId = null, bool isAdmin = false)
        {
            var query = _context.Orders.Include(o => o.Items).AsQueryable();

            if (!isAdmin && userId.HasValue)
            {
                query = query.Where(o => o.UserId == userId.Value);
            }

            return await query.FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<bool> UpdateOrderStatusAsync(int id, string newStatus, string? adminNote = null)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return false;

            order.OrderStatus = newStatus;
            if (!string.IsNullOrEmpty(adminNote))
            {
                order.AdminNote = adminNote;
            }
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class FilterService : IFilterService
    {
        private readonly AppDbContext _context;

        public FilterService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<FilterAttribute>> GetFilterAttributesAsync(int? categoryId = null)
        {
            var query = _context.FilterAttributes
                .Include(f => f.Values)
                .AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(f => f.CategoryId == null || f.CategoryId == categoryId.Value);
            }

            return await query.OrderBy(f => f.DisplayOrder).ToListAsync();
        }

        public async Task<FilterAttribute> CreateFilterAttributeAsync(FilterAttribute attribute)
        {
            _context.FilterAttributes.Add(attribute);
            await _context.SaveChangesAsync();
            return attribute;
        }

        public async Task UpdateFilterAttributeAsync(FilterAttribute attribute)
        {
            attribute.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteFilterAttributeAsync(int id)
        {
            var attribute = await _context.FilterAttributes.FindAsync(id);
            if (attribute == null) return false;
            _context.FilterAttributes.Remove(attribute);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
