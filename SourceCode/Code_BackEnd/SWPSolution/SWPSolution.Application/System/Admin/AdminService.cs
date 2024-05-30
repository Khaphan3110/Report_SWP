using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.System.Admin
{
    
    public class AdminService : IAdminService
    {
        private readonly SWPSolutionDBContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        public AdminService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<AppRole> roleManager, IConfiguration config, SWPSolutionDBContext context, IEmailService emailService) 
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _config = config;
            _context = context;
            _emailService = emailService;
        }
        public async Task<bool> RegisterAdmin(RegisterRequest request)
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

            if (result.Succeeded)
            {
                var admin = new Staff()
                {
                    StaffId = "",
                    FullName = request.FirstName + request.LastName,
                    Username = request.UserName,
                    Password = request.Password,
                    Email = request.Email,
                    Phone = request.PhoneNumber,
                    Role = "staffmember"
                };
                _context.Staff.Add(admin);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            return false;
        }
    }
}
