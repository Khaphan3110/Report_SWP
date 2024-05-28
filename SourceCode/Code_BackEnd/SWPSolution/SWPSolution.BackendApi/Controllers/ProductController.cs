using Microsoft.AspNetCore.Mvc;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok("Test ok");
        }
    }
}
