using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.Catalog.Categories;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Categories;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
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
