using System.Collections.Generic;
using System.Threading.Tasks;
using SobujEnterprise.Application.DTOs;
using SobujEnterprise.Domain.Entities;

namespace SobujEnterprise.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }

    public interface IProductService
    {
        Task<PagedResult<Product>> GetProductsAsync(ProductFilterQuery query);
        Task<Product?> GetProductBySlugAsync(string slug);
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<bool> UpdateProductAsync(int id, Product product);
        Task<bool> DeleteProductAsync(int id);
    }

    public interface IOrderService
    {
        Task<OrderResponseDto> CreateOrderAsync(CreateOrderDto dto, int? userId = null);
        Task<List<Order>> GetOrdersAsync(string? status = null, int? userId = null);
        Task<Order?> GetOrderByIdAsync(int id, int? userId = null, bool isAdmin = false);
        Task<bool> UpdateOrderStatusAsync(int id, string newStatus, string? adminNote = null);
    }

    public interface IWhatsAppService
    {
        Task<string> GenerateWhatsAppOrderUrlAsync(Order order, string storePhoneNumber = "8801827801872");
    }

    public interface IFilterService
    {
        Task<List<FilterAttribute>> GetFilterAttributesAsync(int? categoryId = null);
        Task<FilterAttribute> CreateFilterAttributeAsync(FilterAttribute attribute);
        Task UpdateFilterAttributeAsync(FilterAttribute attribute);
        Task<bool> DeleteFilterAttributeAsync(int id);
    }

    public interface IEngagementService
    {
        Task<IReadOnlyList<ReviewDto>> GetReviewsAsync(int productId);
        Task<ServiceResult<ReviewSubmissionDto>> SubmitReviewAsync(int productId, int userId, ReviewRequestDto request);
        Task<ServiceResult<string>> SubscribeStockAlertAsync(int productId, string email);
        Task<ServiceResult<CouponResultDto>> ValidateCouponAsync(CouponRequestDto request);
    }

    public interface IOperationsService
    {
        Task<IReadOnlyList<LowStockDto>> GetLowStockAsync();
        Task<IReadOnlyList<AuditLog>> GetAuditAsync(int take);
        Task<IReadOnlyList<Coupon>> GetCouponsAsync();
        Task<Coupon> CreateCouponAsync(Coupon coupon);
        Task RecordAuditAsync(int? userId, string action, string entityType, string? entityId, string? details, string? ipAddress);
    }

    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync();
    }
    public interface IReferenceDataService
    {
        Task<IReadOnlyList<Category>> GetCategoriesAsync(); Task<Category?> GetCategoryAsync(string slug); Task<Category> CreateCategoryAsync(Category value); Task<bool> UpdateCategoryAsync(int id, Category value); Task<bool> DeleteCategoryAsync(int id);
        Task<IReadOnlyList<Brand>> GetBrandsAsync(); Task<Brand?> GetBrandAsync(string slug); Task<Brand> CreateBrandAsync(Brand value); Task<bool> UpdateBrandAsync(int id, Brand value); Task<bool> DeleteBrandAsync(int id);
        Task<IReadOnlyList<WhatsAppTemplate>> GetTemplatesAsync(); Task<WhatsAppTemplate?> GetTemplateAsync(string type); Task<WhatsAppTemplate> CreateTemplateAsync(WhatsAppTemplate value); Task<bool> UpdateTemplateAsync(int id, WhatsAppTemplate value); Task<bool> DeleteTemplateAsync(int id);
    }
    public interface IUserAccountService
    {
        Task<UserProfileDto?> GetProfileAsync(int userId); Task<UserProfileDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto);
        Task<IReadOnlyList<UserAddress>> GetAddressesAsync(int userId); Task<UserAddress> CreateAddressAsync(int userId, SaveUserAddressDto dto); Task<UserAddress?> UpdateAddressAsync(int userId, int id, SaveUserAddressDto dto); Task<bool> DeleteAddressAsync(int userId, int id);
        Task<IReadOnlyList<UserProfileDto>> GetUsersAsync(); Task<bool> UpdateRoleAsync(int userId, string role); Task<bool> DeleteUserAsync(int userId);
    }
}
