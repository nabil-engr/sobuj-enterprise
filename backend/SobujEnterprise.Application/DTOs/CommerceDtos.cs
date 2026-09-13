using System.ComponentModel.DataAnnotations;
using SobujEnterprise.Domain.Entities;

namespace SobujEnterprise.Application.DTOs;

public record ReviewRequestDto([Range(1, 5)] int Rating, [Required, MaxLength(120)] string Title, [Required, MaxLength(1500)] string Comment);
public record ReviewDto(int Id, int Rating, string Title, string Comment, bool IsVerifiedPurchase, DateTime CreatedAt, string Customer);
public record ReviewSubmissionDto(string Message, bool VerifiedPurchase);
public record StockAlertRequestDto([Required, EmailAddress] string Email);
public record CouponRequestDto([Required] string Code, [Range(0, double.MaxValue)] decimal Subtotal);
public record CouponResultDto(string Code, decimal Discount);
public record LowStockDto(int Id, string SKU, string Title, int StockQuantity, int LowStockThreshold, int SuggestedReorder);
public record DashboardStatsDto(int TotalOrders, int PendingOrders, int CompletedOrders, decimal TotalSales, decimal DeliveredSales, decimal AverageOrderValue, int RepeatCustomers, decimal EstimatedProfit, int TotalProducts, int LowStockProducts, int TotalCustomers, object RecentOrders);
public record UserProfileDto(int Id, string FullName, string Email, string? PhoneNumber, string Role, DateTime CreatedAt);

public enum ServiceResultStatus { Success, NotFound, Invalid }
public record ServiceResult<T>(ServiceResultStatus Status, T? Value = default, string? Error = null)
{
    public static ServiceResult<T> Ok(T value) => new(ServiceResultStatus.Success, value);
    public static ServiceResult<T> Missing(string error) => new(ServiceResultStatus.NotFound, default, error);
    public static ServiceResult<T> Bad(string error) => new(ServiceResultStatus.Invalid, default, error);
}
