using SWPSolution.ViewModels.System.Users;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.AdminApp.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Configuration;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using SWPSolution.ViewModels.Common;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Http;

namespace SWPSolution.AdminApp.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserApiClient _userApiClient;
        private readonly IConfiguration _configuration;
		public UserController(IUserApiClient userApiClient, IConfiguration configuration) 
        {
            _userApiClient = userApiClient;
            _configuration = configuration;
        }
        public  async Task<IActionResult> Members(string Keyword, int pageIndex = 1, int pageSize = 1)
        {
			var sessions = HttpContext.Session.GetString("Token");
			var user = User.Identity.Name;
            var userRoles = User.Claims
                        .Where(c => c.Type == ClaimTypes.Role)
                        .Select(c => c.Value)
                        .ToList();
            var request = new GetUserPagingRequest()
            {
                BearerToken = sessions,
                Keyword = Keyword,
                PageIndex = pageIndex,
                PageSize = pageSize,
            };
            var data = await _userApiClient.GetUsersPagings(request);
            ViewBag.Keyword = Keyword;
            return View(data);
        }

        public async Task<IActionResult> Staffs(string Keyword, int pageIndex = 1, int pageSize = 1)
        {
            var sessions = HttpContext.Session.GetString("Token");
            var user = User.Identity.Name;
            var userRoles = User.Claims
                        .Where(c => c.Type == ClaimTypes.Role)
                        .Select(c => c.Value)
                        .ToList();
            var request = new GetUserPagingRequest()
            {
                BearerToken = sessions,
                Keyword = Keyword,
                PageIndex = pageIndex,
                PageSize = pageSize,
            };
            var data = await _userApiClient.GetStaffsPagings(request);
            ViewBag.Keyword = Keyword;
            return View(data);
        }

        public async Task<IActionResult> Products(string Keyword, int pageIndex = 1, int pageSize = 1)
        {
            var sessions = HttpContext.Session.GetString("Token");
            var request = new GetUserPagingRequest()
            {
                BearerToken = sessions,
                Keyword = Keyword,
                PageIndex = pageIndex,
                PageSize = pageSize,
            };
            var data = await _userApiClient.GetProductsPagings(request);
            ViewBag.Keyword = Keyword;
            return View(data);
        }

        public async Task<IActionResult> Reviews(string Keyword, int pageIndex = 1, int pageSize = 1)
        {
            var sessions = HttpContext.Session.GetString("Token");
            var request = new GetUserPagingRequest()
            {
                BearerToken = sessions,
                Keyword = Keyword,
                PageIndex = pageIndex,
                PageSize = pageSize,
            };
            var data = await _userApiClient.GetReviewsPagings(request);
            ViewBag.Keyword = Keyword;
            return View(data);
        }

        [HttpGet]
        public async Task<IActionResult> Login()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var token = await _userApiClient.Authenticate(request);

            var userPrincipal = this.ValidateToken(token);

            var userRole = userPrincipal.FindFirst(ClaimTypes.Role)?.Value;
            if (!string.Equals(userRole, "staffadmin", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(userRole, "staffmember", StringComparison.OrdinalIgnoreCase))
            {
                TempData["ErrorMessage"] = "You do not have permission to access this application.";
                return RedirectToAction("Login", "User");
            }

            var authProperties = new AuthenticationProperties
            {
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
                IsPersistent = true
            };

            HttpContext.Session.SetString("Token", token);

            await HttpContext.SignInAsync
            (
                CookieAuthenticationDefaults.AuthenticationScheme,
                userPrincipal,
                authProperties
            );
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Remove("Token");
            return RedirectToAction("Login", "User");
        }

        private ClaimsPrincipal ValidateToken(string jwtToken)
        {
            IdentityModelEventSource.ShowPII = true;

            SecurityToken validatedToken;
            TokenValidationParameters validationParameters = new TokenValidationParameters();

            validationParameters.ValidateLifetime = true;

            validationParameters.ValidAudience = _configuration["JWT:Issuer"];
            validationParameters.ValidIssuer = _configuration["JWT:Issuer"];
            validationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"]));

            ClaimsPrincipal principal = new JwtSecurityTokenHandler().ValidateToken(jwtToken, validationParameters, out validatedToken);

            return principal;
        }

        [HttpGet]
		public async Task<IActionResult> Details(string id)
		{
			var result = await _userApiClient.GetUserById(id);
			return View(result.ResultObj);
		}

        [HttpGet]
        public async Task<IActionResult> StaffDetails(string id)
        {
            var result = await _userApiClient.GetStaffById(id);
            return View(result.ResultObj);
        }

        [HttpGet]
        public async Task<IActionResult> ProductDetails(string id)
        {
            var result = await _userApiClient.GetProductById(id);
            return View(result.ResultObj);
        }

        [HttpGet]
        public async Task<IActionResult> ReviewDetails(string id)
        {
            var result = await _userApiClient.GetReviewById(id);
            return View(result.ResultObj);
        }
    }
}
