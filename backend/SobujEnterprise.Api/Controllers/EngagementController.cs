using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SobujEnterprise.Application.DTOs;
using SobujEnterprise.Application.Interfaces;
using SobujEnterprise.Domain.Entities;

namespace SobujEnterprise.Api.Controllers;

[ApiController, Route("api/engagement")]
public sealed class EngagementController(IEngagementService service) : ControllerBase
{
    [HttpGet("products/{productId:int}/reviews"), AllowAnonymous]
    public async Task<IActionResult> Reviews(int productId) => Ok(await service.GetReviewsAsync(productId));
    [HttpPost("products/{productId:int}/reviews"), Authorize]
    public async Task<IActionResult> Review(int productId, ReviewRequestDto request) { var result = await service.SubmitReviewAsync(productId, int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!), request); return result.Status == ServiceResultStatus.NotFound ? NotFound(new { message = result.Error }) : Accepted(result.Value); }
    [HttpPost("products/{productId:int}/stock-alerts"), AllowAnonymous]
    public async Task<IActionResult> StockAlert(int productId, StockAlertRequestDto request) { var result = await service.SubscribeStockAlertAsync(productId, request.Email); return result.Status == ServiceResultStatus.NotFound ? NotFound(new { message = result.Error }) : Ok(new { message = result.Value }); }
    [HttpPost("coupons/validate"), AllowAnonymous]
    public async Task<IActionResult> ValidateCoupon(CouponRequestDto request) { var result = await service.ValidateCouponAsync(request); return result.Status == ServiceResultStatus.Invalid ? BadRequest(new { message = result.Error }) : Ok(result.Value); }
}

[ApiController, Route("api/admin/operations"), Authorize(Roles = "Admin")]
public sealed class OperationsController(IOperationsService service) : ControllerBase
{
    [HttpGet("low-stock")] public async Task<IActionResult> LowStock() => Ok(await service.GetLowStockAsync());
    [HttpGet("audit")] public async Task<IActionResult> Audit([FromQuery] int take = 100) => Ok(await service.GetAuditAsync(take));
    [HttpGet("coupons")] public async Task<IActionResult> Coupons() => Ok(await service.GetCouponsAsync());
    [HttpPost("coupons")] public async Task<IActionResult> CreateCoupon(Coupon coupon) { var created = await service.CreateCouponAsync(coupon); return Created($"/api/admin/operations/coupons/{created.Id}", created); }
}
