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
using SWPSolution.ViewModels.Catalog.Product;


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
        
        public async Task<PageResult<MemberInfoVM>> GetUsersPagings(GetUserPagingRequest request)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.GetAsync($"/api/Users/paging?pageIndex=" +
                $"{request.PageIndex}&pageSize={request.PageSize}&keyword={request.Keyword}");
            var body = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<PageResult<MemberInfoVM>>(body);
            return users;
        }

		public async Task<ApiResult<MemberInfoVM>> GetUserById(string id)
		{
			var client = _httpClientFactory.CreateClient();
			client.BaseAddress = new Uri(_config["BaseAddress"]);
			var response = await client.GetAsync($"/api/Users/{id}");
			var body = await response.Content.ReadAsStringAsync();
			if (response.IsSuccessStatusCode)
				return JsonConvert.DeserializeObject<ApiSuccessResult<MemberInfoVM>>(body);

			return JsonConvert.DeserializeObject<ApiErrorResult<MemberInfoVM>>(body);
		}

        public async Task<PageResult<StaffInfoVM>> GetStaffsPagings(GetUserPagingRequest request)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.GetAsync($"/api/Users/staffpaging?pageIndex=" +
                $"{request.PageIndex}&pageSize={request.PageSize}&keyword={request.Keyword}");
            var body = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<PageResult<StaffInfoVM>>(body);
            return users;
        }

        public async Task<ApiResult<StaffInfoVM>> GetStaffById(string id)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.GetAsync($"/api/Users/staff/{id}");
            var body = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
                return JsonConvert.DeserializeObject<ApiSuccessResult<StaffInfoVM>>(body);

            return JsonConvert.DeserializeObject<ApiErrorResult<StaffInfoVM>>(body);
        }

        public async Task<PageResult<ProductViewModel>> GetProductsNamePagings(GetUserPagingRequest request)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.GetAsync($"/api/Product/ProductNamePaging?pageIndex=" +
                $"{request.PageIndex}&pageSize={request.PageSize}&keyword={request.Keyword}");
            var body = await response.Content.ReadAsStringAsync();
            var products = JsonConvert.DeserializeObject<PageResult<ProductViewModel>>(body);
            return products;
        }

        public async Task<PageResult<ProductViewModel>> GetProductsCatePagings(GetUserPagingRequest request)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.GetAsync($"/api/Product/ProductCatePaging?pageIndex=" +
                $"{request.PageIndex}&pageSize={request.PageSize}&keyword={request.Keyword}");
            var body = await response.Content.ReadAsStringAsync();
            var products = JsonConvert.DeserializeObject<PageResult<ProductViewModel>>(body);
            return products;
        }

        public async Task<ApiResult<ProductViewModel>> GetProductById(string id)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.GetAsync($"/api/Product/product/{id}");
            var body = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
                return JsonConvert.DeserializeObject<ApiSuccessResult<ProductViewModel>>(body);

            return JsonConvert.DeserializeObject<ApiErrorResult<ProductViewModel>>(body);
        }

        public async Task<PageResult<ReviewVM>> GetReviewsPagings(GetUserPagingRequest request)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.GetAsync($"/api/Product/ReviewPaging?pageIndex=" +
                $"{request.PageIndex}&pageSize={request.PageSize}&keyword={request.Keyword}");
            var body = await response.Content.ReadAsStringAsync();
            var reviews = JsonConvert.DeserializeObject<PageResult<ReviewVM>>(body);
            return reviews;
        }

        public async Task<ApiResult<ReviewVM>> GetReviewById(string id)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseAddress"]);
            var response = await client.GetAsync($"/api/Product/review/{id}");
            var body = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
                return JsonConvert.DeserializeObject<ApiSuccessResult<ReviewVM>>(body);

            return JsonConvert.DeserializeObject<ApiErrorResult<ReviewVM>>(body);
        }
    }
}
