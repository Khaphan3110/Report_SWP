using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.System.User;
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

        public async Task<IActionResult> Authenticate([FromForm] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var resultToken = await _userService.Authencate(request);
            if (string.IsNullOrEmpty(resultToken))
            {
                return BadRequest("Username or password is incorrect.");
            }
            return Ok(new { token = resultToken });
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
<<<<<<< HEAD
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
                return BadRequest(new { message = "OTP must be provided" });
            }

            var result = await _userService.ConfirmEmail(otp);
            if (result)
            {
                return Ok(new { success = true, message = "Email confirmed successfully" });
            }

=======
            if (result)
            {
                var otpResult = await _userService.SendOtp(request.Email);
                if (otpResult)
                {
                    return Ok("Registration successful. OTP sent to your email.");
                }
                else
                {
                    return StatusCode(500, "Registration successful, but failed to send OTP.");
                }
            }
            else
            {
                return BadRequest("Registration failed.");
            }
        }

        [HttpPost("SendOTP")]
        public async Task<IActionResult> SendOTP(string email)
        {
            var otpResult = await _userService.SendOtp(email);
            if(otpResult)
            {
                return Ok("OTP sent to your email.");
            }
            else
            {
                return BadRequest("Failed to send OTP.");
            }
        }



        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string otp)
        {
            if (string.IsNullOrEmpty(otp))
            {
                return BadRequest(new { message = "OTP must be provided" });
            }

            var result = await _userService.ConfirmEmail(otp);
            if (result)
            {
                return Ok(new { success = true, message = "Email confirmed successfully" });
            }

>>>>>>> a10698748190bff25b31c3beefc383314d59336b
            return BadRequest(new { success = false, message = "Email confirmation failed" });
        }

        [HttpPost]
        [AllowAnonymous]

        public async Task<IActionResult> ForgotPassword([Required] string email)
        {
            throw new NotImplementedException();
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
    }
}
