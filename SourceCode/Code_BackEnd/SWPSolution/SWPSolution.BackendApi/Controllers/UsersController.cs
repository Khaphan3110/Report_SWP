using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Categories;
using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        public UsersController(IUserService userService, IConfiguration configuration) 
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("authenticate")]
        [AllowAnonymous]

        public async Task<IActionResult> Authenticate([FromBody]LoginRequest request)
        {
            if(!ModelState.IsValid)
            { 
                return BadRequest(ModelState);
            }
            var resultToken = await _userService.Authenticate(request);
            if(string.IsNullOrEmpty(resultToken))
                {
                return BadRequest("Username or password is incorrect.");
                }
            return Ok(resultToken);
        }

        [HttpPost("google-login")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.HandleGoogleLoginAsync(request);
            if (result == null)
            {
                return BadRequest("Login failed.");
            }

            return Ok(result);
        }


        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
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

        [HttpGet("EmailTest")]
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

        [Authorize]
        [HttpGet("GetAllMembers")]
        public async Task<IActionResult> GetAllMembers()
        {
            var members = await _userService.GetAllMembersAsync();
            return Ok(members);
        }

        [Authorize]
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

        [Authorize]
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

        [Authorize]
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

        [Authorize]
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

        [Authorize]
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

        [Authorize]
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

        [HttpPost("GetMemberByToken")]
        public async Task<IActionResult> GetMemberFromToken([FromBody] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Token is required." });
            }

            try
            {
                var claimsPrincipal = ValidateToken(token);
                var memberIdClaim = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == "member_id");
                var roleClaim = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role);

                if (memberIdClaim == null)
                {
                    return BadRequest(new { message = "Invalid token. Member ID not found." });
                }

                var memberId = memberIdClaim.Value;
                var role = roleClaim?.Value ?? "Role not found";
                var member = await _userService.GetMemberByIdAsync(memberId);

                if (member == null)
                {
                    return NotFound(new { message = "Member not found." });
                }

                return Ok(new { member, Role = role });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", detail = ex.Message });
            }
        }
        private ClaimsPrincipal ValidateToken(string jwtToken)
        {
            IdentityModelEventSource.ShowPII = true;

            var validationParameters = new TokenValidationParameters
            {
                ValidateLifetime = true,
                ValidAudience = _configuration["JWT:Issuer"],
                ValidIssuer = _configuration["JWT:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"]))
            };

            return new JwtSecurityTokenHandler().ValidateToken(jwtToken, validationParameters, out SecurityToken validatedToken);
        }
    }
}
