using System.Security.Claims; using Microsoft.AspNetCore.Authorization; using Microsoft.AspNetCore.Mvc; using SobujEnterprise.Application.DTOs; using SobujEnterprise.Application.Interfaces;
namespace SobujEnterprise.Api.Controllers;
[ApiController,Route("api/[controller]"),Authorize] public sealed class UsersController(IUserAccountService service):ControllerBase
{
 private int? CurrentUserId()=>int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier),out var id)?id:null;
 [HttpGet("profile")] public async Task<IActionResult> GetProfile(){var id=CurrentUserId();if(id is null)return Unauthorized();var x=await service.GetProfileAsync(id.Value);return x is null?NotFound(new{message="User not found."}):Ok(x);}
 [HttpPut("profile")] public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto){var id=CurrentUserId();if(id is null)return Unauthorized();var x=await service.UpdateProfileAsync(id.Value,dto);return x is null?NotFound(new{message="User not found."}):Ok(x);}
 [HttpGet("addresses")] public async Task<IActionResult> GetAddresses(){var id=CurrentUserId();return id is null?Unauthorized():Ok(await service.GetAddressesAsync(id.Value));}
 [HttpPost("addresses")] public async Task<IActionResult> CreateAddress(SaveUserAddressDto dto){var id=CurrentUserId();if(id is null)return Unauthorized();var x=await service.CreateAddressAsync(id.Value,dto);return Created($"api/Users/addresses/{x.Id}",x);}
 [HttpPut("addresses/{id}")] public async Task<IActionResult> UpdateAddress(int id,SaveUserAddressDto dto){var uid=CurrentUserId();if(uid is null)return Unauthorized();var x=await service.UpdateAddressAsync(uid.Value,id,dto);return x is null?NotFound(new{message="Address not found."}):Ok(x);}
 [HttpDelete("addresses/{id}")] public async Task<IActionResult> DeleteAddress(int id){var uid=CurrentUserId();if(uid is null)return Unauthorized();return await service.DeleteAddressAsync(uid.Value,id)?NoContent():NotFound(new{message="Address not found."});}
 [HttpGet,Authorize(Roles="Admin")] public async Task<IActionResult> GetAllUsers()=>Ok(await service.GetUsersAsync());
 [HttpPatch("{id}/role"),Authorize(Roles="Admin")] public async Task<IActionResult> UpdateRole(int id,UpdateUserRoleDto dto){if(id==CurrentUserId())return BadRequest(new{message="You cannot change your own admin role."});return await service.UpdateRoleAsync(id,dto.Role)?NoContent():NotFound(new{message="User or role not found."});}
 [HttpDelete("{id}"),Authorize(Roles="Admin")] public async Task<IActionResult> DeleteUser(int id){if(id==CurrentUserId())return BadRequest(new{message="You cannot delete your own account."});return await service.DeleteUserAsync(id)?NoContent():NotFound(new{message="User not found."});}
}
