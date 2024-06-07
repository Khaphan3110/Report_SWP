
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.Ocsp;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;


namespace SWPSolution.Application.System.User
{
    public class UserService : IUserService
    {
        //private readonly IUrlHelper _urlHelper;
        private readonly SWPSolutionDBContext _context; 
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        
        public UserService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<AppRole> roleManager, IConfiguration config, SWPSolutionDBContext context, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _config = config;
            _context = context;
            _emailService = emailService;
            
        }

        public async Task<string> Authencate(LoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null) return null;

            var result =await _signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, true);
            if (!result.Succeeded)
            {
                return null;
            }

            var roles =await _userManager.GetRolesAsync(user);
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Role, string.Join(";", roles))
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["JWT:Issuer"],
                _config["JWT:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds);

           return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> ConfirmEmail(string otp)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.EmailVerificationCode == otp && u.EmailVerificationExpiry > DateTime.Now);
            if (user == null) return false;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                user.EmailConfirmed = true;
                user.EmailVerificationCode = null;
                user.EmailVerificationExpiry = null;
                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return false;
                }

                var member = new Member()
                {
                    MemberId = "", // Assign a valid MemberId
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Email = user.Email,
                    UserName = user.UserName,
                    PassWord = user.TemporaryPassword, // Assuming PasswordHash is stored in AppUser
                    RegistrationDate = DateTime.Now,
                };
                _context.Members.Add(member);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }


        // public async Task<bool> ForgotPassword([Required] string email)
        // {
        //    var user = await _userManager.FindByEmailAsync(email);
        //    if (user!=null)
        //     {
        //         var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        //         var link = _urlHelper.Action("ResetPassword", "Authentication", new { token, email = user.Email }, Request.Scheme);
        //     }
        // }

        public async Task<bool> Register(RegisterRequest request)
        {
            // Check if a user with the same username and password exists
            var existingUsers = await _userManager.Users
    .Where(u => u.UserName == request.UserName &&
                u.TemporaryPassword == request.Password &&
                u.EmailConfirmed == false)
    .ToListAsync();

            if (existingUsers.Any())
            {
                // If found, delete the existing users
                foreach (var existingUser in existingUsers)
                {
                    var deleteResult = await _userManager.DeleteAsync(existingUser);
                    if (!deleteResult.Succeeded)
                    {
                        return false; // If deletion fails, return false
                    }
                }
            }

            // Proceed with registration of the new user
            var user = new AppUser()
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                UserName = request.UserName,
                TemporaryPassword = request.Password,
                EmailConfirmed = false, // Ensure the email is marked as not confirmed
            };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return false; // If registration fails, return false
            }
            var otpSent = await SendOtp(request.Email);


            return true;
        }

        public async Task<bool> SendOtp(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return false;

            // Generate OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Save OTP and expiration to database
            user.EmailVerificationCode = otp;
            user.EmailVerificationExpiry = DateTime.Now.AddMinutes(10); // OTP expires in 10 minutes
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return false;
            }

            try
            {
                // Send OTP via email
                var message = new MessageVM(new string[] { user.Email }, "Confirm your email", $"<p>Your OTP is: {otp}</p>");
                _emailService.SendEmail(message);
                return true;
            }
            catch (Exception)
            {
                // If email sending fails, remove the user
                await _userManager.DeleteAsync(user);
                return false;
            }
        }
        public Task<bool> TestEmail(string emailAddress)
        {
            var message =
                new MessageVM(
                    new string[] { emailAddress }, "Test", "<h1>Adu Vip</h1>");
            

            try
            {
                _emailService.SendEmail(message);
                return Task.FromResult(true); // Assume success if no exception is thrown
            }
            catch (Exception)
            {
                return Task.FromResult(false); // Return false if an exception is thrown
            }
        }
    }
}
