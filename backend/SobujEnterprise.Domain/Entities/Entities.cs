using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SobujEnterprise.Domain.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class Category : BaseEntity
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Icon { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public int? ParentId { get; set; }
        public Category? Parent { get; set; }
        public bool IsFeatured { get; set; } = false;
        public int DisplayOrder { get; set; } = 0;

        [JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public class Brand : BaseEntity
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        [MaxLength(250)]
        public string? Website { get; set; }

        public bool IsFeatured { get; set; } = false;

        [JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public class Product : BaseEntity
    {
        [Required, MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(250)]
        public string Slug { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string SKU { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [JsonIgnore]
        public decimal? CostPrice { get; set; }

        // Inventory is operational data: it is exposed only by the protected admin endpoint.
        [JsonIgnore]
        public int StockQuantity { get; set; } = 0;
        [JsonIgnore]
        public int LowStockThreshold { get; set; } = 5;

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public int? BrandId { get; set; }
        public Brand? Brand { get; set; }

        [Required, MaxLength(500)]
        public string PrimaryImageUrl { get; set; } = string.Empty;

        public bool IsFeatured { get; set; } = false;
        public bool IsNewArrival { get; set; } = true;
        public bool IsBestSeller { get; set; } = false;

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 5.0m;
        public int ReviewCount { get; set; } = 0;

        [MaxLength(300)]
        public string? Tags { get; set; }

        // JSON array: [{"minQuantity": 12, "unitPrice": 500}, ...].
        public string? WholesaleTiersJson { get; set; }

        public ICollection<ProductImage> GalleryImages { get; set; } = new List<ProductImage>();
        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public ICollection<ProductFilterValue> FilterValues { get; set; } = new List<ProductFilterValue>();
    }

    public class ProductImage : BaseEntity
    {
        public int ProductId { get; set; }
        [JsonIgnore]
        public Product? Product { get; set; }

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;
    }

    public class ProductVariant : BaseEntity
    {
        public int ProductId { get; set; }
        [JsonIgnore]
        public Product? Product { get; set; }

        [Required, MaxLength(100)]
        public string VariantName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string SKU { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceAdjustment { get; set; } = 0.00m;

        [JsonIgnore]
        public int StockQuantity { get; set; } = 0;
    }

    public class FilterAttribute : BaseEntity
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        public int? CategoryId { get; set; }

        [MaxLength(50)]
        public string DisplayType { get; set; } = "Checkbox";

        public int DisplayOrder { get; set; } = 0;

        public ICollection<FilterAttributeValue> Values { get; set; } = new List<FilterAttributeValue>();
    }

    public class FilterAttributeValue : BaseEntity
    {
        public int FilterAttributeId { get; set; }
        [JsonIgnore]
        public FilterAttribute? FilterAttribute { get; set; }

        [Required, MaxLength(100)]
        public string Value { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? ColorHex { get; set; }

        public int DisplayOrder { get; set; } = 0;

        [JsonIgnore]
        public ICollection<ProductFilterValue> ProductFilterValues { get; set; } = new List<ProductFilterValue>();
    }

    public class ProductFilterValue
    {
        public int ProductId { get; set; }
        [JsonIgnore]
        public Product? Product { get; set; }

        public int FilterAttributeValueId { get; set; }
        public FilterAttributeValue? FilterAttributeValue { get; set; }
    }

    public class WhatsAppTemplate : BaseEntity
    {
        [Required, MaxLength(100)]
        public string TemplateType { get; set; } = string.Empty; // Standard_COD, Express_Delivery, Corporate_Bulk

        [Required, MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string MessageFormat { get; set; } = string.Empty;

        public bool IsDefault { get; set; } = false;
    }

    public class Order : BaseEntity
    {
        [Required, MaxLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        public int? UserId { get; set; }
        public User? User { get; set; }

        [Required, MaxLength(150)]
        public string CustomerName { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string CustomerPhone { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? CustomerEmail { get; set; }

        [Required, MaxLength(500)]
        public string DeliveryAddress { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string City { get; set; } = "Dhaka";

        [MaxLength(150)]
        public string? Area { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DeliveryFee { get; set; } = 60.00m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "COD";

        [MaxLength(50)]
        public string PaymentStatus { get; set; } = "Pending";

        [MaxLength(50)]
        public string OrderStatus { get; set; } = "Pending";

        [MaxLength(50)]
        public string OrderType { get; set; } = "Standard_COD";

        [MaxLength(500)]
        public string? CustomerNote { get; set; }

        [MaxLength(500)]
        public string? AdminNote { get; set; }

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class OrderItem : BaseEntity
    {
        public int OrderId { get; set; }
        [JsonIgnore]
        public Order? Order { get; set; }

        public int ProductId { get; set; }
        [JsonIgnore]
        public Product? Product { get; set; }

        [Required, MaxLength(250)]
        public string ProductTitle { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string ProductSKU { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? VariantName { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
    }

    public class Role : BaseEntity
    {
        [Required, MaxLength(50)]
        public string RoleName { get; set; } = string.Empty; // "Admin", "Customer"

        [JsonIgnore]
        public ICollection<User> Users { get; set; } = new List<User>();
    }

    public class User : BaseEntity
    {
        [Required, MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? PhoneNumber { get; set; }

        public int RoleId { get; set; }
        public Role? Role { get; set; }

        [JsonIgnore]
        public ICollection<Order> Orders { get; set; } = new List<Order>();

        [JsonIgnore]
        public ICollection<UserAddress> Addresses { get; set; } = new List<UserAddress>();
    }

    public class UserAddress : BaseEntity
    {
        public int UserId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }

        [Required, MaxLength(80)]
        public string Label { get; set; } = "Home";
        [Required, MaxLength(150)]
        public string RecipientName { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required, MaxLength(500)]
        public string AddressLine { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string City { get; set; } = string.Empty;
        [MaxLength(150)]
        public string? Area { get; set; }
        public bool IsDefault { get; set; }
    }
}
