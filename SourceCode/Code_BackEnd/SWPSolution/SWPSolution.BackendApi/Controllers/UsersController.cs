using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.System.User;
using SWPSolution.ViewModels.Catalog.Categories;
using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService) 
        {
            _userService = userService;
        }

        [HttpPost("authenticate")]
        [AllowAnonymous]

        public async Task<IActionResult> Authenticate([FromForm]LoginRequest request)
        {
            if(!ModelState.IsValid)
            { 
                return BadRequest(ModelState);
            }
            var resultToken = await _userService.Authencate(request);
            if(string.IsNullOrEmpty(resultToken))
                {
                return BadRequest("Username or password is incorrect.");
                }
            return Ok(new {token  = resultToken});
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromForm] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _userService.Register(request);
            if (!result )
            {
                return BadRequest("Register failed.");
            }
            return Ok();
        }
        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string otp)
        {
            if (string.IsNullOrEmpty(otp))
            {
                return BadRequest(new { message = "OTP must be provied" });
            }

            var result = await _userService.ConfirmEmail(otp);
            if (result)
            {
                return Ok(new { message = "Email confirmed successfully" });
            }

            return BadRequest(new { message = "Email confirmation failed" });
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("ForgotPassword")]

        public async Task<IActionResult> ForgotPassword([FromForm][Required] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.ForgotPassword(request.email);
            if (result)
            {
                return Ok(new { Message = "Password reset link has been sent to your email." });
            }

            return NotFound(new { Message = "User not found." });
        }

        [HttpGet("ResetPassword")]
        public async Task<IActionResult> ResetPassword(string token, string email)
        {
            var model = new ResetPasswordVM {Token = token, Email = email };
            return Ok(new
            {
                model
            });
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromForm][Required] ResetPasswordVM model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.ResetPassword(model);
            if (result)
            {
                return Ok(new { Message = "Password has been reset successfully." });
            }

            return BadRequest(new { Message = "Error resetting password." });
        }

        [HttpGet("emailtest")]
        public async Task<IActionResult> TestEmail(string emailAddress)
        {
            if (string.IsNullOrEmpty(emailAddress))
            {
                return BadRequest("Email address is required.");
            }

            var result = await _userService.TestEmail(emailAddress);
            if (!result)
            {
                return BadRequest("Email send failed.");
            }

            return Ok("Email sent successfully.");

        }

        [HttpGet("members")]
        public async Task<IActionResult> GetAllMembers()
        {
            var members = await _userService.GetAllMembersAsync();
            return Ok(members);
        }

        [HttpGet("GetMember/{id}")]
        public async Task<IActionResult> GetMemberById(string id)
        {
            var member = await _userService.GetMemberByIdAsync(id);
            if (member == null)
            {
                return NotFound(new { message = "Member not found" });
            }
            return Ok(member);
        }

        [HttpPut("UpdateMember/{id}")]
        public async Task<IActionResult> UpdateMember(string id, [FromBody] UpdateMemberRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.UpdateMemberAsync(id, request);
            if (!result)
            {
                return NotFound(new { message = "Member not found" });
            }

            return Ok(new { message = "Member updated successfully" });
        }

        [HttpGet("GetAddress/{id}/address")]
        public async Task<IActionResult> GetMemberAddressById(string id)
        {
            var address = await _userService.GetMemberAddressByIdAsync(id);
            if (address == null)
            {
                return NotFound(new { message = "Member not found" });
            }
            return Ok(address);
        }

        [HttpPut("UpdateAddress/{id}/address")]
        public async Task<IActionResult> UpdateMemberAddress(string id, [FromBody] UpdateAddressRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.UpdateMemberAddressAsync(id, request);
            if (!result)
            {
                return NotFound(new { message = "Member not found" });
            }

            return Ok(new { message = "Address updated successfully" });
        }

        [HttpPost("AddAddress/{id}/address")]
        public async Task<IActionResult> AddMemberAddress(string id, [FromBody] AddAddressRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.AddMemberAddressAsync(id, request);
            if (!result)
            {
                return NotFound(new { message = "Member not found" });
            }

            return Ok(new { message = "Address added successfully" });
        }

        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpDelete("DeleteAddress/{id}/address")]
        public async Task<IActionResult> DeleteMemberAddress(string id)
        {
            var result = await _userService.DeleteMemberAddressAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Address not found" });
            }

            return Ok(new { message = "Address deleted successfully" });
        }
    }
}
