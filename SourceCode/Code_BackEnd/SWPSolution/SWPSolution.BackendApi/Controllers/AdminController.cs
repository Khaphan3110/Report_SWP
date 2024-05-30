using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.System.Admin;
using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService) 
        {
            _adminService = adminService;
        }

        [Authorize]
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
    }
}
