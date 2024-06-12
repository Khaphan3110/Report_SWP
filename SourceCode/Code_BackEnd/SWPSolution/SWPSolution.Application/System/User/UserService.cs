using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Data.Entities;
<<<<<<< HEAD

using SWPSolution.ViewModels.Common;

=======
using SWPSolution.ViewModels.Common;
>>>>>>> 0b12b4dbed67dd702b6eb0c910472ad9af2f5de0
using SWPSolution.ViewModels.System.Users;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LoginRequest = SWPSolution.ViewModels.System.Users.LoginRequest;
using RegisterRequest = SWPSolution.ViewModels.System.Users.RegisterRequest;


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
        private readonly IUrlHelperFactory _urlHelperFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            RoleManager<AppRole> roleManager,
            IConfiguration config,
            SWPSolutionDBContext context,
            IEmailService emailService,
            IUrlHelperFactory urlHelperFactory,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _config = config;
            _context = context;
            _emailService = emailService;
            _urlHelperFactory = urlHelperFactory;
            _httpContextAccessor = httpContextAccessor;
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

        public async Task<object> HandleGoogleLoginAsync(GoogleLoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user != null)
            {
                // User exists, generate token
                var roles = await _userManager.GetRolesAsync(user);
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

                return new { token = new JwtSecurityTokenHandler().WriteToken(token) };
            }
            else
            {
                // User does not exist, register user
                var password = PasswordGenerator.GeneratePassword(); // Generate a secure password
                var registerRequest = new RegisterRequest
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    UserName = request.Email, // Assuming email as username
                    Password = password // Use the generated secure password
                };
                var registerResult = await Register(registerRequest);
                if (!registerResult)
                {
                    return null;
                }

                var newUser = await _userManager.FindByEmailAsync(request.Email);
                var roles = await _userManager.GetRolesAsync(newUser);
                var claims = new[]
                {
            new Claim(ClaimTypes.Email, newUser.Email),
            new Claim(ClaimTypes.GivenName, newUser.FirstName),
            new Claim(ClaimTypes.Role, string.Join(";", roles))
        };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(_config["JWT:Issuer"],
                    _config["JWT:Issuer"],
                    claims,
                    expires: DateTime.Now.AddHours(3),
                    signingCredentials: creds);

                return new { token = new JwtSecurityTokenHandler().WriteToken(token) };
            }
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


        public async Task<bool> ForgotPassword([Required] string email)
         {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var request = _httpContextAccessor.HttpContext.Request;
                var actionContext = new ActionContext(_httpContextAccessor.HttpContext, _httpContextAccessor.HttpContext.GetRouteData(), new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
                var urlHelper = _urlHelperFactory.GetUrlHelper(actionContext);

                // Replace the base URL with your custom website domain
                var baseUrl = _config["AppUrl"];

                // Generate the action URL
<<<<<<< HEAD

                var resetPasswordUrl = $"{baseUrl}?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}";

=======
>>>>>>> 0b12b4dbed67dd702b6eb0c910472ad9af2f5de0

                var resetPasswordUrl = $"{baseUrl}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}";

                var message = new MessageVM(new string[] { user.Email! }, "Forgot Password link", resetPasswordUrl);

                //var forgotPasswordLink = urlHelper.Action(nameof(ResetPassword), "Users", new { token, email = user.Email }, request.Scheme);
               // var message = new MessageVM(new string[] { user.Email! }, "Forgot Password link", forgotPasswordLink!);
                _emailService.SendEmail(message);
                return true;
            }
            return false;
        }
        public async Task<bool> ResetPassword(ResetPasswordVM model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return false; // Handle user not found
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            if (result.Succeeded)
            {
                // Assuming you have a DbContext or a repository to handle database operations
                var appUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);   
                var member = await _context.Members.FirstOrDefaultAsync(m => m.Email == model.Email);

                if (appUser != null)
                {
                    appUser.TemporaryPassword = model.Password; // Or however you want to store it
                }

                if (member != null)
                {
                    member.PassWord = model.Password; // Or however you want to store it
                }

                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }



        public async Task<bool> Register(RegisterRequest request)
        {
            var existingUsers = await _userManager.Users.Where(u => u.UserName == request.UserName &&
                u.TemporaryPassword == request.Password &&
                u.EmailConfirmed == false)
    .ToListAsync();
            if (existingUsers.Any())
            {
                foreach (var existingUser in existingUsers)
                {
                    var deleteResult = await _userManager.DeleteAsync(existingUser);
                    if (!deleteResult.Succeeded)
                    {
                        return false;
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
        public async Task<bool> DeleteUserAsync(string memberId)
        {
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return false;

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return true;
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

        public async Task<List<MemberInfoVM>> GetAllMembersAsync()
        {
            var members = await _context.Members
                                        .Select(m => new MemberInfoVM
                                        {
                                            UserName = m.UserName,
                                            Email = m.Email
                                        })
                                        .ToListAsync();
            return members;
        }

        public async Task<MemberInfoVM> GetMemberByIdAsync(string memberId)
        {
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return null;

            return new MemberInfoVM
            {
                UserName = member.UserName,
                Email = member.Email,
                FirstName = member.FirstName,
                LastName = member.LastName,
                PhoneNumber = member.PhoneNumber
            };
        }

        public async Task<bool> UpdateMemberAsync(string memberId, UpdateMemberRequest request)
        {
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return false;

            if (!string.IsNullOrEmpty(request.FirstName))
                member.FirstName = request.FirstName;

            if (!string.IsNullOrEmpty(request.LastName))
                member.LastName = request.LastName;

            if (!string.IsNullOrEmpty(request.PhoneNumber))
                member.PhoneNumber = request.PhoneNumber;

            _context.Members.Update(member);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<MemberAddressVM> GetMemberAddressByIdAsync(string memberId)
        {
            var address = await _context.Addresses.FindAsync(memberId);
            if (address == null) return null;

            return new MemberAddressVM
            {
                House_Number = address.HouseNumber,
                Street_Name = address.Street,
                District_Name = address.District,
                City = address.City,
                Region = address.Region
            };
        }

        public async Task<bool> UpdateMemberAddressAsync(string memberId, UpdateAddressRequest request)
        {
            var address = await _context.Addresses.FindAsync(memberId);
            if (address == null) return false;

            if (!string.IsNullOrEmpty(request.House_Numbers))
                address.HouseNumber = request.House_Numbers;

            if (!string.IsNullOrEmpty(request.Street_Name))
                address.Street = request.Street_Name;

            if (!string.IsNullOrEmpty(request.District_Name))
                address.District = request.District_Name;

            if (!string.IsNullOrEmpty(request.City))
                address.City = request.City;

            if (!string.IsNullOrEmpty(request.Region))
                address.Region = request.Region;

            _context.Addresses.Update(address);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AddMemberAddressAsync(string memberId, AddAddressRequest request)
        {
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return false;

            var address = new Address
            {
                AddressId = "",
                MemberId = memberId,
                HouseNumber = request.House_Numbers,
                Street = request.Street_Name,
                District = request.District_Name,
                City = request.City,
                Region = request.Region
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteMemberAddressAsync(string id)
        {
            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.MemberId == id || a.AddressId == id);
            if (address == null)
                return false;

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<ApiResult<bool>> RoleAssign(Guid id, RoleAssignRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return new ApiErrorResult<bool>("Tài khoản không tồn tại");
            }
            var removedRoles = request.Roles.Where(x=> x.Selected == false).Select(x => x.Name).ToList();
            await _userManager.RemoveFromRolesAsync(user, removedRoles);

            var addedRoles = request.Roles.Where(x => x.Selected == true).Select(x => x.Name).ToList();
            foreach(var roleName in addedRoles) 
            {
                if(await _userManager.IsInRoleAsync(user, roleName) == false)
                {
                    await _userManager.AddToRolesAsync(user, addedRoles);
                }
            }
            return new ApiSuccessResult<bool>();
        }
    }
}
