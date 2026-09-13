using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SobujEnterprise.Application.Interfaces;

namespace SobujEnterprise.Api.Controllers;

[ApiController, Route("api/[controller]"), Authorize(Roles = "Admin")]
public sealed class DashboardController(IDashboardService service) : ControllerBase
{
    [HttpGet("stats")] public async Task<IActionResult> GetDashboardStats() => Ok(await service.GetStatsAsync());
}
