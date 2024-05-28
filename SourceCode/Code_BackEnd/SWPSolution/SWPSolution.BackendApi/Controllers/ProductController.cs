using System.Drawing.Text;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.Catalog.Product;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly IPublicProductService _publicProductService;
        public ProductController(IPublicProductService publicProductService)
        {
            _publicProductService = publicProductService;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products =await _publicProductService.GetAll();
            return Ok(products);
        }
    }
}
