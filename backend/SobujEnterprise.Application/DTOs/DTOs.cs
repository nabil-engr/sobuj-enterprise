using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SobujEnterprise.Application.DTOs
{
    // Auth DTOs
    public class RegisterDto
    {
        [Required, StringLength(150, MinimumLength = 2)]
        public string FullName { get; set; } = string.Empty;
        [Required, EmailAddress, StringLength(150)]
        public string Email { get; set; } = string.Empty;
        [Required, StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; } = "Customer"; // "Admin" or "Customer"
    }

    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }

    // Order DTOs
    public class CreateOrderDto
    {
        [Required, StringLength(150, MinimumLength = 2)]
        public string CustomerName { get; set; } = string.Empty;
        [Required, RegularExpression(@"^\+?[0-9]{10,15}$")]
        public string CustomerPhone { get; set; } = string.Empty;
        public string? CustomerEmail { get; set; }
        [Required, StringLength(500, MinimumLength = 5)]
        public string DeliveryAddress { get; set; } = string.Empty;
        public string? City { get; set; } = "Dhaka";
        public string? Area { get; set; }
        public string? PaymentMethod { get; set; } = "COD";
        public string? OrderType { get; set; } = "Standard_COD";
        public string? CustomerNote { get; set; }
        [Required, MinLength(1)]
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }

    public class CreateOrderItemDto
    {
        [Range(1, int.MaxValue)]
        public int ProductId { get; set; }
        public string? VariantName { get; set; }
        [Range(1, 10000)]
        public int Quantity { get; set; }
    }

    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public decimal SubTotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal TotalAmount { get; set; }
        public string WhatsAppOrderUrl { get; set; } = string.Empty;
    }

    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? AdminNote { get; set; }
    }

    public class UpdateUserRoleDto
    {
        [Required, RegularExpression("^(Admin|Customer)$")]
        public string Role { get; set; } = "Customer";
    }

    public class UpdateProfileDto
    {
        [Required, StringLength(150, MinimumLength = 2)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? PhoneNumber { get; set; }
    }

    public class SaveUserAddressDto
    {
        [Required, StringLength(80)] public string Label { get; set; } = "Home";
        [Required, StringLength(150)] public string RecipientName { get; set; } = string.Empty;
        [Required, StringLength(50)] public string PhoneNumber { get; set; } = string.Empty;
        [Required, StringLength(500)] public string AddressLine { get; set; } = string.Empty;
        [Required, StringLength(100)] public string City { get; set; } = string.Empty;
        [StringLength(150)] public string? Area { get; set; }
        public bool IsDefault { get; set; }
    }

    // Product DTOs
    public class ProductFilterQuery
    {
        public int? CategoryId { get; set; }
        public int? BrandId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? FilterValueIds { get; set; }
        public string? Search { get; set; }
        public string? SortBy { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }

    public class PagedResult<T>
    {
        public int TotalItems { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public List<T> Items { get; set; } = new();
    }
}
