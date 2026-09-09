using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobujEnterprise.Infrastructure.Persistence;

namespace SobujEnterprise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalOrders = await _context.Orders.CountAsync();
            var pendingOrders = await _context.Orders.CountAsync(o => o.OrderStatus == "Pending");
            var completedOrders = await _context.Orders.CountAsync(o => o.OrderStatus == "Delivered");
            var totalSales = await _context.Orders.SumAsync(o => o.TotalAmount);

            var totalProducts = await _context.Products.CountAsync();
            var lowStockProducts = await _context.Products.CountAsync(p => p.StockQuantity <= p.LowStockThreshold);
            var totalCustomers = await _context.Users.CountAsync(u => u.Role!.RoleName == "Customer");

            var recentOrders = await _context.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    o.CustomerName,
                    o.TotalAmount,
                    o.OrderStatus,
                    o.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                TotalOrders = totalOrders,
                PendingOrders = pendingOrders,
                CompletedOrders = completedOrders,
                TotalSales = totalSales,
                TotalProducts = totalProducts,
                LowStockProducts = lowStockProducts,
                TotalCustomers = totalCustomers,
                RecentOrders = recentOrders
            });
        }
    }
}

