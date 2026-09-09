using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SobujEnterprise.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UploadsController : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
    private readonly IWebHostEnvironment _environment;

    public UploadsController(IWebHostEnvironment environment) => _environment = environment;

    [HttpPost("product-image")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadProductImage(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest(new { message = "Please select an image." });
        if (file.Length > 5 * 1024 * 1024) return BadRequest(new { message = "Image must be 5 MB or smaller." });
        var extension = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(extension)) return BadRequest(new { message = "Only JPG, PNG, WEBP and GIF images are allowed." });

        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var uploadDirectory = Path.Combine(webRoot, "uploads", "products");
        Directory.CreateDirectory(uploadDirectory);
        var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        await using var stream = System.IO.File.Create(Path.Combine(uploadDirectory, fileName));
        await file.CopyToAsync(stream);
        return Ok(new { url = $"{Request.Scheme}://{Request.Host}/uploads/products/{fileName}" });
    }
}
