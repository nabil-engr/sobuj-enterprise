using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobujEnterprise.Infrastructure.Persistence;
using SobujEnterprise.Application.DTOs;
using SobujEnterprise.Domain.Entities;

namespace SobujEnterprise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users/profile (Current User Profile)
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound(new { message = "User not found." });

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.PhoneNumber,
                Role = user.Role?.RoleName,
                user.CreatedAt
            });
        }

        // PUT: api/users/profile (Update Current User Profile)
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { message = "User not found." });

            if (!string.IsNullOrWhiteSpace(dto.FullName)) user.FullName = dto.FullName.Trim();
            if (dto.PhoneNumber != null) user.PhoneNumber = dto.PhoneNumber.Trim();
            user.UpdatedAt = System.DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.PhoneNumber,
                Role = user.Role?.RoleName,
                user.CreatedAt
            });
        }

        [HttpGet("addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            var userId = CurrentUserId();
            if (userId == null) return Unauthorized();
            var addresses = await _context.UserAddresses.Where(a => a.UserId == userId).OrderByDescending(a => a.IsDefault).ThenByDescending(a => a.UpdatedAt ?? a.CreatedAt).ToListAsync();
            return Ok(addresses);
        }

        [HttpPost("addresses")]
        public async Task<IActionResult> CreateAddress([FromBody] SaveUserAddressDto dto)
        {
            var userId = CurrentUserId();
            if (userId == null) return Unauthorized();
            if (dto.IsDefault) await _context.UserAddresses.Where(a => a.UserId == userId).ExecuteUpdateAsync(s => s.SetProperty(a => a.IsDefault, false));
            var address = new UserAddress { UserId = userId.Value, Label = dto.Label.Trim(), RecipientName = dto.RecipientName.Trim(), PhoneNumber = dto.PhoneNumber.Trim(), AddressLine = dto.AddressLine.Trim(), City = dto.City.Trim(), Area = dto.Area?.Trim(), IsDefault = dto.IsDefault };
            _context.UserAddresses.Add(address);
            await _context.SaveChangesAsync();
            return Created($"api/Users/addresses/{address.Id}", address);
        }

        [HttpPut("addresses/{id}")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] SaveUserAddressDto dto)
        {
            var userId = CurrentUserId();
            if (userId == null) return Unauthorized();
            var address = await _context.UserAddresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
            if (address == null) return NotFound(new { message = "Address not found." });
            if (dto.IsDefault) await _context.UserAddresses.Where(a => a.UserId == userId && a.Id != id).ExecuteUpdateAsync(s => s.SetProperty(a => a.IsDefault, false));
            address.Label = dto.Label.Trim(); address.RecipientName = dto.RecipientName.Trim(); address.PhoneNumber = dto.PhoneNumber.Trim(); address.AddressLine = dto.AddressLine.Trim(); address.City = dto.City.Trim(); address.Area = dto.Area?.Trim(); address.IsDefault = dto.IsDefault; address.UpdatedAt = System.DateTime.UtcNow;
            await _context.SaveChangesAsync(); return Ok(address);
        }

        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var userId = CurrentUserId();
            if (userId == null) return Unauthorized();
            var address = await _context.UserAddresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
            if (address == null) return NotFound(new { message = "Address not found." });
            _context.UserAddresses.Remove(address); await _context.SaveChangesAsync(); return NoContent();
        }

        private int? CurrentUserId()
        {
            var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(raw, out var id) ? id : null;
        }

        // GET: api/users (Admin Only: List all users)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.PhoneNumber,
                    Role = u.Role != null ? u.Role.RoleName : "Customer",
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPatch("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateUserRoleDto dto)
        {
            if (id.ToString() == User.FindFirstValue(ClaimTypes.NameIdentifier))
                return BadRequest(new { message = "You cannot change your own admin role." });
            var user = await _context.Users.FindAsync(id);
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == dto.Role);
            if (user == null || role == null) return NotFound(new { message = "User or role not found." });
            user.RoleId = role.Id;
            user.UpdatedAt = System.DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (id.ToString() == User.FindFirstValue(ClaimTypes.NameIdentifier))
                return BadRequest(new { message = "You cannot delete your own account." });
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
