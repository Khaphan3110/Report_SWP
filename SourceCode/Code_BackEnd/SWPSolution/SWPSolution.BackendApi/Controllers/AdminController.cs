using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.System.Admin;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Blog;
using SWPSolution.ViewModels.System.Users;
namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {

        private readonly IAdminService _adminService;
        
        public AdminController(IAdminService adminService) 
        {
            _adminService = adminService;
            
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterAdmin([FromForm] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _adminService.RegisterAdmin(request);
            if (!result)
            {
                return BadRequest("Register failed.");
            }
            return Ok();
        }

        [HttpPost("RoleAssign")]
        public async Task<IActionResult> RoleAssign(Guid id, string memberId)
        {
            return null;
        }

        [HttpPost("CreateBlog/{id}/createBlog")]
        public async Task<IActionResult> Create(string id,[FromForm] BlogCreateRequest request)
        {
            if (request == null)
            {
                return BadRequest();
            }

            var result = await _adminService.CreateBlogAsync(id, request);
            if (!result)
            {
                return NotFound(new { message = "Staff not found" });
            }

            return Ok(new { message = "Blog created successfully." });
        }

        [HttpGet("GetAllBlogs")]
        public async Task<ActionResult<List<Blog>>> GetAllBlogsAsync()
        {
            var blogs = await _adminService.GetAllBlogsAsync();

            if (blogs == null || blogs.Count == 0)
            {
                return NotFound("No blogs found in the database.");
            }

            return Ok(blogs);
        }

        [HttpGet("GetBlog/{id}")]
        public async Task<IActionResult> GetBlogById(string id)
        {
            var blog = await _adminService.GetBlogByIdAsync(id);
            if (blog == null)
            {
                return NotFound(new { message = "No blogs were found" });
            }
            return Ok(blog);
        }

        [HttpPut("UpdateBlog/{id}/blog")]
        public async Task<IActionResult> UpdateBlog(string id, [FromBody] UpdateBlogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _adminService.UpdateBlogAsync(id, request);
            if (!result)
            {
                return NotFound(new { message = "No blogs were found" });
            }

            return Ok(new { message = "Blog updated successfully" });
        }

        [HttpDelete("DeleteBlog/{id}/blog")]
        public async Task<IActionResult> DeleteBlog(string id)
        {
            var result = await _adminService.DeleteBlogAsync(id);
            if (!result)
            {
                return NotFound(new { message = "No blogs were found" });
            }

            return Ok(new { message = "Blog deleted successfully" });
        }

        [HttpPost("AddOrder/{memberId}/order")]
        public async Task<IActionResult> AddOrder(string memberId, [FromBody] AddOrderRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _adminService.AddOrder(memberId, request);
            if (!result)
            {
                return NotFound(new { message = "Member not found" });
            }

            return Ok(new { message = "Order added successfully" });
        }

        [HttpPut("UpdateOrder/{id}/order")]
        public async Task<IActionResult> UpdateOrder(string id, OrderUpdateRequest request)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _adminService.UpdateOrder(id, request);
            if (!result)
            {
                return NotFound(new { Message = "Order not found." });
            }

            return Ok(new { Message = "Order updated successfully." });
        }

        [HttpDelete("DeleteOrder/{id}/order")]
        public async Task<IActionResult> DeleteOrder(string id)
        {
            var result = await _adminService.DeleteOrder(id);
            if (!result)
            {
                return NotFound(new { Message = "Order not found." });
            }

            return Ok(new { Message = "Order deleted successfully." });
        }

        [HttpGet("GetOrder/{id}/order")]
        public async Task<IActionResult> GetOrderById(string id)
        {
            var order = await _adminService.GetOrderById(id);
            if (order == null)
            {
                return NotFound(new { Message = "Order not found." });
            }

            return Ok(order);
        }

        [HttpGet("GetAllOrder")]
        public async Task<IActionResult> GetAllCategories()
        {
            var order = await _adminService.GetAllOrder();
            if (order == null)
            {
                return NotFound(new { message = "No orders were found" });
            }
            return Ok(order);
        }
    }
}
