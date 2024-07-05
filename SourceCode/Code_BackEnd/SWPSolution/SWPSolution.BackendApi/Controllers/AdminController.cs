using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.System.Admin;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Blog;
using SWPSolution.ViewModels.System.Users;
using System.Security.Claims;
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

        [HttpPost("AuthenticateAdmin")]
        [AllowAnonymous]
        public async Task<IActionResult> AuthenticateAdmin([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var resultToken = await _adminService.AuthenticateAdmin(request);
            if (string.IsNullOrEmpty(resultToken))
            {
                return BadRequest("Username or password is incorrect.");
            }
            return Ok(resultToken);
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

        [HttpGet("ConfirmEmail")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string otp)
        {
            if (string.IsNullOrEmpty(otp))
            {
                return BadRequest(new { message = "OTP must be provied" });
            }

            var result = await _adminService.ConfirmEmail(otp);
            if (result)
            {
                return Ok(new { message = "Email confirmed successfully" });
            }

            return BadRequest(new { message = "Email confirmation failed" });
        }

        [HttpPost("GetAdminByToken")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAdminByToken([FromBody] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Token is required." });
            }

            try
            {
                var claimsPrincipal = _adminService.ValidateToken(token);
                var adminIdClaim = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == "admin_id");

                if (adminIdClaim == null)
                {
                    return BadRequest(new { message = "Invalid token. Admin ID not found." });
                }

                var adminId = adminIdClaim.Value;
                var admin = await _adminService.GetAdminById(adminId);

                if (admin == null)
                {
                    return NotFound(new { message = "Admin not found." });
                }

                return Ok(admin);
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("UpdateAdminByToken")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateAdminByToken([FromQuery] string jwtToken, [FromBody] UpdateAdminRequest request)
        {
            if (string.IsNullOrEmpty(jwtToken))
            {
                return BadRequest(new { message = "Token is required." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var adminId = await _adminService.ExtractAdminIdFromTokenAsync(jwtToken);

                var result = await _adminService.UpdateAdmin(adminId, request);
                if (!result)
                {
                    return NotFound(new { message = "Admin not found" });
                }

                return Ok(new { message = "Admin updated successfully" });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("ResetAdminPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetAdminPassword(string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _adminService.ResetAdminPassword(email);
            if (!result)
            {
                return NotFound(new { message = "Admin not found" });
            }

            return Ok(new { message = "OTP sent successfully" });
        }

        [HttpPost("ConfirmAdmin")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmAdmin(string otp, UpdateStaffRequest request)
        {
            try
            {
                var result = await _adminService.ConfirmAdmin(otp, request);
                if (result)
                    return Ok(new { message = "Admin updated successfully" });
                else
                    return BadRequest("Failed to confirm staff or invalid OTP.");
            } 
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error confirming staff: {ex.Message}");
            }
        }

        [HttpDelete("DeleteAdminByToken")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteAdminByToken([FromQuery] string jwtToken)
        {
            if (string.IsNullOrEmpty(jwtToken))
            {
                return BadRequest(new { message = "Token is required." });
            }

            try
            {
                var memberId = await _adminService.ExtractAdminIdFromTokenAsync(jwtToken);

                var result = await _adminService.DeleteAdmin(memberId);
                if (!result)
                {
                    return NotFound(new { message = "Admin not found" });
                }

                return Ok(new { message = "Admin deleted successfully" });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
