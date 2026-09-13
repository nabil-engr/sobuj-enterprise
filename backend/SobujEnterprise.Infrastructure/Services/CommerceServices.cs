using Microsoft.EntityFrameworkCore;
using SobujEnterprise.Application.DTOs;
using SobujEnterprise.Application.Interfaces;
using SobujEnterprise.Domain.Entities;
using SobujEnterprise.Infrastructure.Persistence;

namespace SobujEnterprise.Infrastructure.Services;

public sealed class EngagementService(AppDbContext db) : IEngagementService
{
    public async Task<IReadOnlyList<ReviewDto>> GetReviewsAsync(int productId) => await db.ProductReviews.AsNoTracking().Where(r => r.ProductId == productId && r.IsApproved).OrderByDescending(r => r.CreatedAt).Select(r => new ReviewDto(r.Id, r.Rating, r.Title, r.Comment, r.IsVerifiedPurchase, r.CreatedAt, r.User!.FullName)).ToListAsync();

    public async Task<ServiceResult<ReviewSubmissionDto>> SubmitReviewAsync(int productId, int userId, ReviewRequestDto request)
    {
        if (!await db.Products.AnyAsync(p => p.Id == productId)) return ServiceResult<ReviewSubmissionDto>.Missing("Product not found.");
        var verified = await db.Orders.AnyAsync(o => o.UserId == userId && o.OrderStatus == "Delivered" && o.Items.Any(i => i.ProductId == productId));
        var review = await db.ProductReviews.SingleOrDefaultAsync(r => r.ProductId == productId && r.UserId == userId);
        if (review is null) db.ProductReviews.Add(review = new ProductReview { ProductId = productId, UserId = userId });
        review.Rating = request.Rating; review.Title = request.Title.Trim(); review.Comment = request.Comment.Trim(); review.IsVerifiedPurchase = verified; review.IsApproved = false; review.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return ServiceResult<ReviewSubmissionDto>.Ok(new("Review submitted for moderation.", verified));
    }

    public async Task<ServiceResult<string>> SubscribeStockAlertAsync(int productId, string rawEmail)
    {
        if (!await db.Products.AnyAsync(p => p.Id == productId)) return ServiceResult<string>.Missing("Product not found.");
        var email = rawEmail.Trim().ToLowerInvariant();
        if (!await db.StockAlerts.AnyAsync(a => a.ProductId == productId && a.Email == email)) { db.StockAlerts.Add(new StockAlert { ProductId = productId, Email = email }); await db.SaveChangesAsync(); }
        return ServiceResult<string>.Ok("We will email you when this product is available.");
    }

    public async Task<ServiceResult<CouponResultDto>> ValidateCouponAsync(CouponRequestDto request)
    {
        var now = DateTime.UtcNow; var code = request.Code.Trim().ToUpperInvariant();
        var coupon = await db.Coupons.AsNoTracking().SingleOrDefaultAsync(c => c.Code == code && c.IsActive && c.StartsAt <= now && c.EndsAt >= now);
        if (coupon is null || (coupon.UsageLimit > 0 && coupon.UsedCount >= coupon.UsageLimit) || request.Subtotal < coupon.MinimumOrder) return ServiceResult<CouponResultDto>.Bad("Coupon is not valid for this order.");
        var discount = coupon.IsPercentage ? request.Subtotal * coupon.DiscountValue / 100 : coupon.DiscountValue;
        return ServiceResult<CouponResultDto>.Ok(new(coupon.Code, Math.Min(discount, request.Subtotal)));
    }
}

public sealed class OperationsService(AppDbContext db) : IOperationsService
{
    public async Task<IReadOnlyList<LowStockDto>> GetLowStockAsync() => await db.Products.AsNoTracking().Where(p => p.StockQuantity <= p.LowStockThreshold).OrderBy(p => p.StockQuantity).Select(p => new LowStockDto(p.Id, p.SKU, p.Title, p.StockQuantity, p.LowStockThreshold, Math.Max(p.LowStockThreshold * 3 - p.StockQuantity, 0))).ToListAsync();
    public async Task<IReadOnlyList<AuditLog>> GetAuditAsync(int take) => await db.AuditLogs.AsNoTracking().OrderByDescending(a => a.CreatedAt).Take(Math.Clamp(take, 1, 500)).ToListAsync();
    public async Task<IReadOnlyList<Coupon>> GetCouponsAsync() => await db.Coupons.AsNoTracking().OrderByDescending(c => c.CreatedAt).ToListAsync();
    public async Task<Coupon> CreateCouponAsync(Coupon coupon) { coupon.Code = coupon.Code.Trim().ToUpperInvariant(); coupon.CreatedAt = DateTime.UtcNow; db.Coupons.Add(coupon); await db.SaveChangesAsync(); return coupon; }
    public async Task RecordAuditAsync(int? userId, string action, string entityType, string? entityId, string? details, string? ipAddress) { db.AuditLogs.Add(new AuditLog { UserId = userId, Action = action, EntityType = entityType, EntityId = entityId, Details = details, IpAddress = ipAddress }); await db.SaveChangesAsync(); }
}

public sealed class DashboardService(AppDbContext db) : IDashboardService
{
    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var totalOrders = await db.Orders.CountAsync(); var pending = await db.Orders.CountAsync(o => o.OrderStatus == "Pending"); var completed = await db.Orders.CountAsync(o => o.OrderStatus == "Delivered"); var sales = await db.Orders.SumAsync(o => (decimal?)o.TotalAmount) ?? 0;
        var delivered = await db.Orders.Where(o => o.OrderStatus == "Delivered").SumAsync(o => (decimal?)o.TotalAmount) ?? 0; var repeat = await db.Orders.Where(o => o.UserId != null).GroupBy(o => o.UserId).CountAsync(g => g.Count() > 1); var profit = await db.OrderItems.Where(i => i.Order!.OrderStatus == "Delivered").SumAsync(i => (decimal?)((i.UnitPrice - (i.Product!.CostPrice ?? i.UnitPrice)) * i.Quantity)) ?? 0;
        var products = await db.Products.CountAsync(); var low = await db.Products.CountAsync(p => p.StockQuantity <= p.LowStockThreshold); var customers = await db.Users.CountAsync(u => u.Role!.RoleName == "Customer"); var recent = await db.Orders.OrderByDescending(o => o.CreatedAt).Take(5).Select(o => new { o.Id, o.OrderNumber, o.CustomerName, o.TotalAmount, o.OrderStatus, o.CreatedAt }).ToListAsync();
        return new(totalOrders, pending, completed, sales, delivered, totalOrders == 0 ? 0 : sales / totalOrders, repeat, profit, products, low, customers, recent);
    }
}

public sealed class ReferenceDataService(AppDbContext db) : IReferenceDataService
{
    public async Task<IReadOnlyList<Category>> GetCategoriesAsync() => await db.Categories.AsNoTracking().OrderBy(x => x.DisplayOrder).ToListAsync();
    public Task<Category?> GetCategoryAsync(string slug) => db.Categories.AsNoTracking().Include(x => x.Products).FirstOrDefaultAsync(x => x.Slug == slug);
    public async Task<Category> CreateCategoryAsync(Category value) { db.Categories.Add(value); await db.SaveChangesAsync(); return value; }
    public async Task<bool> UpdateCategoryAsync(int id, Category value) { var current = await db.Categories.FindAsync(id); if (current is null) return false; db.Entry(current).CurrentValues.SetValues(value); current.Id = id; await db.SaveChangesAsync(); return true; }
    public async Task<bool> DeleteCategoryAsync(int id) { var value = await db.Categories.FindAsync(id); if (value is null) return false; db.Remove(value); await db.SaveChangesAsync(); return true; }
    public async Task<IReadOnlyList<Brand>> GetBrandsAsync() => await db.Brands.AsNoTracking().OrderBy(x => x.Name).ToListAsync();
    public Task<Brand?> GetBrandAsync(string slug) => db.Brands.AsNoTracking().Include(x => x.Products).FirstOrDefaultAsync(x => x.Slug == slug);
    public async Task<Brand> CreateBrandAsync(Brand value) { db.Brands.Add(value); await db.SaveChangesAsync(); return value; }
    public async Task<bool> UpdateBrandAsync(int id, Brand value) { var current = await db.Brands.FindAsync(id); if (current is null) return false; db.Entry(current).CurrentValues.SetValues(value); current.Id = id; await db.SaveChangesAsync(); return true; }
    public async Task<bool> DeleteBrandAsync(int id) { var value = await db.Brands.FindAsync(id); if (value is null) return false; db.Remove(value); await db.SaveChangesAsync(); return true; }
    public async Task<IReadOnlyList<WhatsAppTemplate>> GetTemplatesAsync() => await db.WhatsAppTemplates.AsNoTracking().OrderByDescending(x => x.IsDefault).ToListAsync();
    public Task<WhatsAppTemplate?> GetTemplateAsync(string type) => db.WhatsAppTemplates.AsNoTracking().FirstOrDefaultAsync(x => x.TemplateType == type);
    public async Task<WhatsAppTemplate> CreateTemplateAsync(WhatsAppTemplate value) { value.CreatedAt = DateTime.UtcNow; db.Add(value); await db.SaveChangesAsync(); return value; }
    public async Task<bool> UpdateTemplateAsync(int id, WhatsAppTemplate value) { var current = await db.WhatsAppTemplates.FindAsync(id); if (current is null) return false; db.Entry(current).CurrentValues.SetValues(value); current.Id = id; await db.SaveChangesAsync(); return true; }
    public async Task<bool> DeleteTemplateAsync(int id) { var value = await db.WhatsAppTemplates.FindAsync(id); if (value is null) return false; db.Remove(value); await db.SaveChangesAsync(); return true; }
}

public sealed class UserAccountService(AppDbContext db) : IUserAccountService
{
    public Task<UserProfileDto?> GetProfileAsync(int id)=>db.Users.AsNoTracking().Where(u=>u.Id==id).Select(u=>new UserProfileDto(u.Id,u.FullName,u.Email,u.PhoneNumber,u.Role!=null?u.Role.RoleName:"Customer",u.CreatedAt)).FirstOrDefaultAsync();
    public async Task<UserProfileDto?> UpdateProfileAsync(int id,UpdateProfileDto dto){var u=await db.Users.Include(x=>x.Role).FirstOrDefaultAsync(x=>x.Id==id);if(u is null)return null;u.FullName=dto.FullName.Trim();u.PhoneNumber=dto.PhoneNumber?.Trim();u.UpdatedAt=DateTime.UtcNow;await db.SaveChangesAsync();return new(u.Id,u.FullName,u.Email,u.PhoneNumber,u.Role?.RoleName??"Customer",u.CreatedAt);}
    public async Task<IReadOnlyList<UserAddress>> GetAddressesAsync(int id)=>await db.UserAddresses.AsNoTracking().Where(a=>a.UserId==id).OrderByDescending(a=>a.IsDefault).ThenByDescending(a=>a.UpdatedAt??a.CreatedAt).ToListAsync();
    public async Task<UserAddress> CreateAddressAsync(int id,SaveUserAddressDto d){if(d.IsDefault)await ClearDefaults(id);var a=Map(new UserAddress{UserId=id},d);db.Add(a);await db.SaveChangesAsync();return a;}
    public async Task<UserAddress?> UpdateAddressAsync(int uid,int id,SaveUserAddressDto d){var a=await db.UserAddresses.FirstOrDefaultAsync(x=>x.Id==id&&x.UserId==uid);if(a is null)return null;if(d.IsDefault)await ClearDefaults(uid,id);Map(a,d);a.UpdatedAt=DateTime.UtcNow;await db.SaveChangesAsync();return a;}
    public async Task<bool> DeleteAddressAsync(int uid,int id){var a=await db.UserAddresses.FirstOrDefaultAsync(x=>x.Id==id&&x.UserId==uid);if(a is null)return false;db.Remove(a);await db.SaveChangesAsync();return true;}
    public async Task<IReadOnlyList<UserProfileDto>> GetUsersAsync()=>await db.Users.AsNoTracking().Select(u=>new UserProfileDto(u.Id,u.FullName,u.Email,u.PhoneNumber,u.Role!=null?u.Role.RoleName:"Customer",u.CreatedAt)).ToListAsync();
    public async Task<bool> UpdateRoleAsync(int id,string role){var u=await db.Users.FindAsync(id);var r=await db.Roles.FirstOrDefaultAsync(x=>x.RoleName==role);if(u is null||r is null)return false;u.RoleId=r.Id;u.UpdatedAt=DateTime.UtcNow;await db.SaveChangesAsync();return true;}
    public async Task<bool> DeleteUserAsync(int id){var u=await db.Users.FindAsync(id);if(u is null)return false;db.Remove(u);await db.SaveChangesAsync();return true;}
    private Task ClearDefaults(int uid,int? except=null)=>db.UserAddresses.Where(a=>a.UserId==uid&&(!except.HasValue||a.Id!=except)).ExecuteUpdateAsync(s=>s.SetProperty(a=>a.IsDefault,false));
    private static UserAddress Map(UserAddress a,SaveUserAddressDto d){a.Label=d.Label.Trim();a.RecipientName=d.RecipientName.Trim();a.PhoneNumber=d.PhoneNumber.Trim();a.AddressLine=d.AddressLine.Trim();a.City=d.City.Trim();a.Area=d.Area?.Trim();a.IsDefault=d.IsDefault;return a;}
}
