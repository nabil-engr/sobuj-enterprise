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
}
