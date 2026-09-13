using Microsoft.AspNetCore.Authorization; using Microsoft.AspNetCore.Mvc; using SobujEnterprise.Application.Interfaces; using SobujEnterprise.Domain.Entities;
namespace SobujEnterprise.Api.Controllers;
[ApiController, Route("api/[controller]"), Authorize(Roles="Admin")] public sealed class WhatsAppTemplatesController(IReferenceDataService service) : ControllerBase
{
 [HttpGet] public async Task<IActionResult> GetTemplates()=>Ok(await service.GetTemplatesAsync());
 [HttpGet("{type}")] public async Task<IActionResult> GetTemplateByType(string type){var x=await service.GetTemplateAsync(type);return x is null?NotFound(new{message="Template not found."}):Ok(x);}
 [HttpPost] public async Task<IActionResult> CreateTemplate(WhatsAppTemplate x){var created=await service.CreateTemplateAsync(x);return CreatedAtAction(nameof(GetTemplateByType),new{type=created.TemplateType},created);}
 [HttpPut("{id}")] public async Task<IActionResult> UpdateTemplate(int id,WhatsAppTemplate x)=>id!=x.Id?BadRequest(new{message="Template ID mismatch."}):await service.UpdateTemplateAsync(id,x)?NoContent():NotFound();
 [HttpDelete("{id}")] public async Task<IActionResult> DeleteTemplate(int id)=>await service.DeleteTemplateAsync(id)?NoContent():NotFound();
}
