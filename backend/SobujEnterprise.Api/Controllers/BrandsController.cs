using Microsoft.AspNetCore.Authorization; using Microsoft.AspNetCore.Mvc; using SobujEnterprise.Application.Interfaces; using SobujEnterprise.Domain.Entities;
namespace SobujEnterprise.Api.Controllers;
[ApiController, Route("api/[controller]")] public sealed class BrandsController(IReferenceDataService service) : ControllerBase
{
 [HttpGet, AllowAnonymous] public async Task<IActionResult> GetBrands()=>Ok(await service.GetBrandsAsync());
 [HttpGet("{slug}"), AllowAnonymous] public async Task<IActionResult> GetBrandBySlug(string slug){var x=await service.GetBrandAsync(slug);return x is null?NotFound(new{message="Brand not found."}):Ok(x);}
 [HttpPost, Authorize(Roles="Admin")] public async Task<IActionResult> CreateBrand(Brand x){var created=await service.CreateBrandAsync(x);return CreatedAtAction(nameof(GetBrandBySlug),new{slug=created.Slug},created);}
 [HttpPut("{id}"), Authorize(Roles="Admin")] public async Task<IActionResult> UpdateBrand(int id,Brand x)=>id!=x.Id?BadRequest(new{message="Brand ID mismatch."}):await service.UpdateBrandAsync(id,x)?NoContent():NotFound();
 [HttpDelete("{id}"), Authorize(Roles="Admin")] public async Task<IActionResult> DeleteBrand(int id)=>await service.DeleteBrandAsync(id)?NoContent():NotFound();
}
