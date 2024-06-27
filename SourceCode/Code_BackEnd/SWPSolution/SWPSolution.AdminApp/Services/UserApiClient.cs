using SWPSolution.ViewModels.System.Users;
using Newtonsoft.Json;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Categories;
using SWPSolution.ViewModels.Common;
using System.Data.Entity;


namespace SWPSolution.AdminApp.Services
{
    public class UserApiClient : IUserApiClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly SWPSolutionDBContext _context;

        public UserApiClient(IHttpClientFactory httpClientFactory, SWPSolutionDBContext context)
        {
            _httpClientFactory = httpClientFactory;
            _context = context;
            _context = context;
        }

        public async Task<string> Authenticate(LoginRequest request)
        {
            var json = JsonConvert.SerializeObject(request);
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri("https://localhost:44358");
            var response = await client.PostAsync("/api/Users/authenticate", httpContent);
            var token = await response.Content.ReadAsStringAsync();
            return token;
        }

        public async Task<PageResult<UserVm>> GetAllPaging(GetUserPagingRequest request)
        {
            // 1. Query with Filtering
            var query = _context.AppUsers.AsQueryable(); // Start from Categories table

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                // Adjust filtering to your relevant category fields
                query = query.Where(c => c.UserName.Contains(request.Keyword) ||
                                        c.Email.Contains(request.Keyword)
                                       // ... other fields you want to filter on
                                       );
            }

            // 2. Projection to UserVm (No need for joins here)
            var userData = await query.Select(c => new UserVm
            {
                Id = Guid.NewGuid(),
                FirstName = c.FirstName,
                LastName = c.LastName,
                PhoneNumber = c.PhoneNumber,
                UserName = c.UserName,
                Email = c.Email,
            }).ToListAsync();

            // 3. Paging (Same as before)
            int totalRow = userData.Count;
            var pagedData = userData
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            // 4. Result
            return new PageResult<UserVm>
            {
                TotalRecord = totalRow,
                Items = pagedData
            };
        }
    }
}
