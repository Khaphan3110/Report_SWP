
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Data.Entities;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
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

        

        public async Task<bool> Register(RegisterRequest request)
        {
            var transaction = await _context.Database.BeginTransactionAsync();
            var user = new AppUser()
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                UserName = request.UserName,

            };
            var result = await _userManager.CreateAsync(user, request.Password);
            
            if(result.Succeeded)
            {
                var member = new Member()
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PhoneNumber = request.PhoneNumber,
                    Email = request.Email,
                    UserName = request.UserName,
                    PassWord = request.Password,
                    RegistrationDate = DateTime.Now,
                };
                _context.Members.Add(member);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                
                return true;
            }
            return false;
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
