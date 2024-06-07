using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Blog;
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

        public async Task<bool> CreateBlogAsync(string staffId, BlogCreateRequest request)
        {
            var staff = await _context.Staff.FindAsync(staffId);
            if (staff == null) return false;

            var blog = new Blog
            {
                BlogId = "",
                Title = request.Title,
                Content = request.Content,
                Categories = request.Categories,
                DateCreate = DateTime.Now,
                StaffId = staffId
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<Blog>> GetAllBlogsAsync()
        {
            var blogs = await _context.Blogs.ToListAsync();

            var blogDetails = blogs.Select(blog => new Blog
            {
                BlogId = blog.BlogId,
                Title = blog.Title,
                Content = blog.Content,
                Categories = blog.Categories,
                DateCreate = blog.DateCreate,
                StaffId = blog.StaffId
            }).ToList();

            return blogDetails;
        }

        public async Task<BlogDetailVM> GetBlogByIdAsync(string id)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(a => a.BlogId == id || a.StaffId == id);
            if (blog == null) return null;

            return new BlogDetailVM
            {
                Title = blog.Title,
                Content = blog.Content,
                Categories = blog.Categories,
                DateCreate = blog.DateCreate,
            };
        }

        public async Task<bool> UpdateBlogAsync(string staffId, UpdateBlogRequest request)
        {
            var blog = await _context.Blogs.FindAsync(staffId);
            if (blog == null) return false;

            if (!string.IsNullOrEmpty(request.Title))
                blog.Title = request.Title;

            if (!string.IsNullOrEmpty(request.Content))
                blog.Content = request.Content;

            if (!string.IsNullOrEmpty(request.Categories))
                blog.Categories = request.Categories;

            _context.Blogs.Update(blog);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteBlogAsync(string blogId)
        {
            var blog = await _context.Blogs.FindAsync(blogId);
            if (blog == null)
                return false;

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
