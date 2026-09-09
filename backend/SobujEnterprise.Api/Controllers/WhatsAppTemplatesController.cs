using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobujEnterprise.Domain.Entities;
using SobujEnterprise.Infrastructure.Persistence;

namespace SobujEnterprise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class WhatsAppTemplatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WhatsAppTemplatesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/whatsapptemplates
        [HttpGet]
        public async Task<IActionResult> GetTemplates()
        {
            var templates = await _context.WhatsAppTemplates
                .OrderByDescending(t => t.IsDefault)
                .ToListAsync();
            return Ok(templates);
        }

        // GET: api/whatsapptemplates/{type}
        [HttpGet("{type}")]
        public async Task<IActionResult> GetTemplateByType(string type)
        {
            var template = await _context.WhatsAppTemplates
                .FirstOrDefaultAsync(t => t.TemplateType == type);

            if (template == null) return NotFound(new { message = "Template not found." });
            return Ok(template);
        }

        // POST: api/whatsapptemplates
        [HttpPost]
        public async Task<IActionResult> CreateTemplate([FromBody] WhatsAppTemplate template)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            template.CreatedAt = DateTime.UtcNow;
            _context.WhatsAppTemplates.Add(template);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTemplateByType), new { type = template.TemplateType }, template);
        }

        // PUT: api/whatsapptemplates/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTemplate(int id, [FromBody] WhatsAppTemplate template)
        {
            if (id != template.Id) return BadRequest(new { message = "Template ID mismatch." });
            _context.Entry(template).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/whatsapptemplates/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemplate(int id)
        {
            var template = await _context.WhatsAppTemplates.FindAsync(id);
            if (template == null) return NotFound(new { message = "Template not found." });
            _context.WhatsAppTemplates.Remove(template);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

