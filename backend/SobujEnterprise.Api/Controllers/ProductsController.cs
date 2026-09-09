using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SobujEnterprise.Application.DTOs;
using SobujEnterprise.Application.Interfaces;
using SobujEnterprise.Domain.Entities;

namespace SobujEnterprise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: api/products?categoryId=1&brandId=2&minPrice=100&maxPrice=1000&filterValueIds=1,3&search=paper&sortBy=price_asc&page=1&pageSize=12
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetProducts([FromQuery] ProductFilterQuery query)
        {
            var result = await _productService.GetProductsAsync(query);
            return Ok(result);
        }

        // GET: api/products/admin - includes inventory fields for staff only.
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminProducts()
        {
            var result = await _productService.GetProductsAsync(new ProductFilterQuery { Page = 1, PageSize = 500 });
            return Ok(result.Items.Select(p => new
            {
                p.Id, p.Title, p.Slug, p.SKU, p.ShortDescription, p.Description,
                p.Price, p.DiscountPrice, p.StockQuantity, p.LowStockThreshold,
                p.CategoryId, p.Category, p.BrandId, p.Brand, p.PrimaryImageUrl,
                p.IsFeatured, p.IsNewArrival, p.IsBestSeller, p.Rating, p.ReviewCount, p.Tags, p.WholesaleTiersJson,
                p.GalleryImages, p.Variants
            }));
        }

        // GET: api/products/{slug}
        [HttpGet("{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductBySlug(string slug)
        {
            var product = await _productService.GetProductBySlugAsync(slug);
            if (product == null) return NotFound(new { message = "Product not found." });
            return Ok(product);
        }

        // GET: api/products/id/{id}
        [HttpGet("id/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound(new { message = "Product not found." });
            return Ok(product);
        }

        // POST: api/products (Admin Only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _productService.CreateProductAsync(product);
            return CreatedAtAction(nameof(GetProductBySlug), new { slug = created.Slug }, created);
        }

        // PUT: api/products/{id} (Admin Only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id) return BadRequest(new { message = "Product ID mismatch." });
            var success = await _productService.UpdateProductAsync(id, product);
            if (!success) return NotFound(new { message = "Product not found." });
            return NoContent();
        }

        // DELETE: api/products/{id} (Admin Only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var success = await _productService.DeleteProductAsync(id);
            if (!success) return NotFound(new { message = "Product not found." });
            return NoContent();
        }
    }
}
