using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.Catalog.Categories;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Categories;
using SWPSolution.ViewModels.Catalog.Product;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet("get-total-category")]
        public async Task<ActionResult<int>> GetTotalProductCount()
        {
            var totalProducts = await _categoryService.GetTotalCategoryCountAsync();
            return Ok(totalProducts);
        }

        [HttpPost("CreateCategory")]
        public async Task<IActionResult> CreateCategory([FromForm] CategoryCreateRequest request)
        {
            if (request == null)
            {
                return BadRequest();
            }
            var result = await _categoryService.Create(request);
            return Ok(new { message = "New Category created successfully." });
        }
        [HttpPost("CreateMultiple")]
        public async Task<IActionResult> CreateMultiple([FromBody] List<CategoryCreateRequest> requests)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _categoryService.CreateMultiple(requests);
            if (!result)
                return StatusCode(500, "A problem happened while handling your request.");

            return Ok();
        }


        [HttpGet("get-paging")]
        public async Task<IActionResult> Get([FromQuery] CategoryPagingRequest request)
        {
            var categories = await _categoryService.GetAllPaging(request);
            return Ok(categories);
        }

        [HttpPut("UpdateCategory/{id}/category")]
        public async Task<IActionResult> UpdateCategory(string id, CategoryUpdateRequest request)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _categoryService.Update(id, request);
            if (!result)
            {
                return NotFound(new { Message = "Category not found." });
            }

            return Ok(new { Message = "Category updated successfully." });
        }

        [HttpDelete("DeleteCategory/{id}/category")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var result = await _categoryService.Delete(id);
            if (!result)
            {
                return NotFound(new { Message = "Category not found." });
            }

            return Ok(new { Message = "Category deleted successfully." });
        }

        [HttpGet("GetCategory/{id}/category")]
        public async Task<IActionResult> GetCategoryById(string id)
        {
            var category = await _categoryService.GetById(id);
            if (category == null)
            {
                return NotFound(new { Message = "Category not found." });
            }

            return Ok(category);
        }

        [HttpGet("GetCategoryByName/{name}/category")]
        public async Task<IActionResult> GetCategoryByName(string name)
        {
            var category = await _categoryService.GetByName(name);
            if (category == null)
            {
                return NotFound(new { Message = "Category not found." });
            }

            return Ok(category);
        }

        [HttpGet("GetAllCategory")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAll();
            if (categories == null)
            {
                return NotFound(new { message = "No categories were found" });
            }
            return Ok(categories);
        }
    }
}
