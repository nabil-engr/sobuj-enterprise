using Microsoft.AspNetCore.Authorization; using Microsoft.AspNetCore.Mvc; using SobujEnterprise.Application.Interfaces; using SobujEnterprise.Domain.Entities;
namespace SobujEnterprise.Api.Controllers;
[ApiController, Route("api/[controller]")] public sealed class CategoriesController(IReferenceDataService service) : ControllerBase
{
 [HttpGet, AllowAnonymous] public async Task<IActionResult> GetCategories()=>Ok(await service.GetCategoriesAsync());
 [HttpGet("{slug}"), AllowAnonymous] public async Task<IActionResult> GetCategoryBySlug(string slug){var x=await service.GetCategoryAsync(slug);return x is null?NotFound(new{message="Category not found."}):Ok(x);}
 [HttpPost, Authorize(Roles="Admin")] public async Task<IActionResult> CreateCategory(Category x){var created=await service.CreateCategoryAsync(x);return CreatedAtAction(nameof(GetCategoryBySlug),new{slug=created.Slug},created);}
 [HttpPut("{id}"), Authorize(Roles="Admin")] public async Task<IActionResult> UpdateCategory(int id,Category x)=>id!=x.Id?BadRequest(new{message="Category ID mismatch."}):await service.UpdateCategoryAsync(id,x)?NoContent():NotFound();
 [HttpDelete("{id}"), Authorize(Roles="Admin")] public async Task<IActionResult> DeleteCategory(int id)=>await service.DeleteCategoryAsync(id)?NoContent():NotFound();
}
