using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SobujEnterprise.Application.DTOs;
using SobujEnterprise.Application.Interfaces;

namespace SobujEnterprise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // POST: api/orders (Public / Guest / Customer order submission)
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PlaceOrder([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            int? userId = null;
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }

            try
            {
                var result = await _orderService.CreateOrderAsync(dto, userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/orders (Admin Only: View all orders)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetOrders([FromQuery] string? status)
        {
            var orders = await _orderService.GetOrdersAsync(status);
            return Ok(orders);
        }

        // GET: api/orders/my-orders (Customer: View own orders)
        [HttpGet("my-orders")]
        [Authorize]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var orders = await _orderService.GetOrdersAsync(null, userId);
            return Ok(orders);
        }

        // GET: api/orders/{id} (Authorized: Admin can view any, Customer can view own)
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetOrder(int id)
        {
            var isAdmin = User.IsInRole("Admin");
            int? userId = null;
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }

            var order = await _orderService.GetOrderByIdAsync(id, userId, isAdmin);
            if (order == null) return NotFound(new { message = "Order not found." });
            return Ok(order);
        }

        // PATCH: api/orders/{id}/status (Admin Only)
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var success = await _orderService.UpdateOrderStatusAsync(id, dto.Status, dto.AdminNote);
            if (!success) return NotFound(new { message = "Order not found." });
            return NoContent();
        }

        // POST: api/orders/{id}/cancel (Customer: Cancel own pending order)
        [HttpPost("{id}/cancel")]
        [Authorize]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var isAdmin = User.IsInRole("Admin");
            var order = await _orderService.GetOrderByIdAsync(id, userId, isAdmin);
            if (order == null) return NotFound(new { message = "Order not found." });

            if (order.OrderStatus != "Pending")
            {
                return BadRequest(new { message = "Only pending orders can be cancelled. Please contact hotline 01712-204763 for processed orders." });
            }

            var success = await _orderService.UpdateOrderStatusAsync(id, "Cancelled", "Cancelled by customer via account portal.");
            if (!success) return BadRequest(new { message = "Unable to cancel order." });
            return Ok(new { message = "Order successfully cancelled." });
        }
    }
}
