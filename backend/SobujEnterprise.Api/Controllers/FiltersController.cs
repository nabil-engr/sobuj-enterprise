using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SobujEnterprise.Application.Interfaces;
using SobujEnterprise.Domain.Entities;

namespace SobujEnterprise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FiltersController : ControllerBase
    {
        private readonly IFilterService _filterService;

        public FiltersController(IFilterService filterService)
        {
            _filterService = filterService;
        }

        // GET: api/filters?categoryId=1
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetFilterAttributes([FromQuery] int? categoryId)
        {
            var attributes = await _filterService.GetFilterAttributesAsync(categoryId);
            return Ok(attributes);
        }

        // POST: api/filters (Admin Only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateFilterAttribute([FromBody] FilterAttribute attribute)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _filterService.CreateFilterAttributeAsync(attribute);
            return Ok(created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFilterAttribute(int id, [FromBody] FilterAttribute attribute)
        {
            if (id != attribute.Id) return BadRequest(new { message = "Filter ID mismatch." });
            var existing = await _filterService.GetFilterAttributesAsync();
            var target = existing.FirstOrDefault(x => x.Id == id);
            if (target == null) return NotFound(new { message = "Filter not found." });
            target.Name = attribute.Name;
            target.Code = attribute.Code;
            target.CategoryId = attribute.CategoryId;
            target.DisplayType = attribute.DisplayType;
            target.DisplayOrder = attribute.DisplayOrder;
            await _filterService.UpdateFilterAttributeAsync(target);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFilterAttribute(int id)
        {
            return await _filterService.DeleteFilterAttributeAsync(id)
                ? NoContent()
                : NotFound(new { message = "Filter not found." });
        }
    }
}
