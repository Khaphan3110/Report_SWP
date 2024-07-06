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
using System.Net.Http.Headers;


namespace SWPSolution.AdminApp.Services
{
    public class UserApiClient : IUserApiClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;
		private readonly IHttpContextAccessor _httpContextAccessor;

		public UserApiClient(IHttpClientFactory httpClientFactory, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _httpClientFactory = httpClientFactory;
			_httpContextAccessor = httpContextAccessor;
			_config = config;
        }

        public async Task<string> Authenticate(LoginRequest request)
        {
            var json = JsonConvert.SerializeObject(request);
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.PostAsync("/api/Users/authenticatestaff", httpContent);
            var token = await response.Content.ReadAsStringAsync();
            return token;
        }
        
        public async Task<PageResult<UserVm>> GetUsersPagings(GetUserPagingRequest request)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", request.BearerToken);
            var response = await client.GetAsync($"/api/Users/paging?pageIndex=" +
                $"{request.PageIndex}&pageSize={request.PageSize}&keyword={request.Keyword}");
            var body = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<PageResult<UserVm>>(body);
            return users;
        }

		public async Task<ApiResult<UserVm>> GetById(Guid id)
		{
			var sessions = _httpContextAccessor.HttpContext.Session.GetString("Token");
			var client = _httpClientFactory.CreateClient();
			client.BaseAddress = new Uri(_config["BaseAddress"]);
			client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", sessions);
			var response = await client.GetAsync($"/api/Users/{id}");
			var body = await response.Content.ReadAsStringAsync();
			if (response.IsSuccessStatusCode)
				return JsonConvert.DeserializeObject<ApiSuccessResult<UserVm>>(body);

			return JsonConvert.DeserializeObject<ApiErrorResult<UserVm>>(body);
		}
	}
}
