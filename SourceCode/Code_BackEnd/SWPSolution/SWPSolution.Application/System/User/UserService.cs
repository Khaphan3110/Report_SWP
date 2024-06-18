using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Data.Entities;

using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Logging;
using System.Configuration;


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
        private readonly IConfiguration _configuration;
       

        public UserService(UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            RoleManager<AppRole> roleManager,
            IConfiguration config,
            SWPSolutionDBContext context,
            IEmailService emailService,
            IUrlHelperFactory urlHelperFactory,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _config = config;
            _context = context;
            _emailService = emailService;
            _urlHelperFactory = urlHelperFactory;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        public async Task<string> Authenticate(LoginRequest request)
        {
            // Find the user by username
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null)
            {
                return null; // User not found
            }

            // Check if the provided password is correct
            var result = await _signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, true);
            if (!result.Succeeded)
            {
                return null; // Invalid password
            }

            // Retrieve member_id from your member table based on the username
            string memberId = await GetMemberIdByUsername(request.UserName);

            // Get user roles
            var getRoles = await _userManager.GetRolesAsync(user);

            // Create claims for the token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Name, request.UserName),
                new Claim("member_id", memberId.ToString())  // Add member_id as a custom claim
            };

            // Add roles to claims
            foreach (var role in getRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Generate JWT token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _config["JWT:Issuer"],
                _config["JWT:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds);

            // Write and return the token
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Method to retrieve member_id from the member table
        private async Task<string> GetMemberIdByUsername(string username)
        {
            // Assuming you have access to your database context
            var member = _context.Members.FirstOrDefault(m => m.UserName == username);
            if (member != null)
            {
                return member.MemberId;
            }
            else
            {
                // Handle case where member is not found (optional)
                throw new SWPException("Error getting Member ID"); // or throw an exception or handle as appropriate
            }
        }
        private async Task<string> GetMemberIdByEmail(string email)
        {
            // Assuming you have access to your database context
            var member = _context.Members.FirstOrDefault(m => m.Email == email);
            if (member != null)
            {
                return member.MemberId;
            }
            else
            {
                // Handle case where member is not found (optional)
                throw new SWPException("Error getting Member ID"); // or throw an exception or handle as appropriate
            }
        }


        public async Task<object> HandleGoogleLoginAsync(GoogleLoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user != null)
            {
                // User exists, generate token
                string memberId = await GetMemberIdByEmail(request.Email);
                var roles = await _userManager.GetRolesAsync(user);
                var token = GenerateJwtToken(user, roles, memberId);

                return new { token };
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
                if (registerResult)
                {
                    var member = new Member()
                    {
                        MemberId = "",
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        Email = request.Email,
                        UserName = request.Email,
                        PassWord = password, // Store securely, hash if using Identity
                        RegistrationDate = DateTime.Now,
                    };
                    _context.Members.Add(member);
                }
                try
                {
                    await _context.SaveChangesAsync();

                    // Retrieve newly registered user
                    var newUser = await _userManager.FindByEmailAsync(request.Email);
                    var roles = await _userManager.GetRolesAsync(newUser);

                    // Set EmailConfirmed = true
                    newUser.EmailConfirmed = true;
                    await _userManager.UpdateAsync(newUser);

                    string memberId = await GetMemberIdByEmail(request.Email); // Use newly generated memberId
                    var token = GenerateJwtToken(newUser, roles, memberId);

                    return new { token };
                }
                catch (Exception ex)
                {
                    // Handle database save error appropriately (log, return error response, etc.)
                    Console.WriteLine($"Error saving member: {ex.Message}");
                    throw; // Rethrow or handle as appropriate
                }
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

                var resetPasswordUrl = $"{baseUrl}?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}";


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
                var appUser = await _context.AppUsers.FirstOrDefaultAsync(u => u.Email == model.Email);   
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
            var existingUsers = _userManager.Users.Where(u => u.UserName == request.UserName &&
                u.TemporaryPassword == request.Password &&
                u.EmailConfirmed == false)
    .ToList();
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

        public async Task<MemberInfoVM> GetMemberByMailAsync(string email)
        {
            var member = await _context.Members.FindAsync(email);
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

        public async Task<MemberAddressVM> GetMemberAddressById(string memberId)
        {
            var address = _context.Addresses.FirstOrDefault(a => a.MemberId == memberId);

            if (address == null)
            {
                throw new KeyNotFoundException($"Address for member ID {memberId} not found.");
            }

            return new MemberAddressVM
            {
                House_Number = address.HouseNumber,
                Street_Name = address.Street,
                District_Name = address.District,
                City = address.City,
                Region = address.Region
            };
        }

        public async Task<bool> UpdateMemberAddress(string memberId, UpdateAddressRequest request)
        {
            var address = _context.Addresses.FirstOrDefault(a => a.MemberId == memberId);
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

        public async Task<bool> DeleteMemberAddress(string id)
        {
            var address = _context.Addresses.FirstOrDefault(a => a.MemberId == id);
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


        private string GenerateJwtToken(AppUser user, IList<string> roles, string memberId)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.GivenName, user.FirstName),
        new Claim(ClaimTypes.Role, string.Join(";", roles)),
        new Claim("member_id", memberId)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _config["JWT:Issuer"],
                _config["JWT:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


         public ClaimsPrincipal ValidateToken(string jwtToken)
        {
            IdentityModelEventSource.ShowPII = true;

            var validationParameters = new TokenValidationParameters
            {
                ValidateLifetime = true,
                ValidAudience = _configuration["JWT:Issuer"],
                ValidIssuer = _configuration["JWT:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"]))
            };

            return new JwtSecurityTokenHandler().ValidateToken(jwtToken, validationParameters, out SecurityToken validatedToken);
        }


        public async Task<string> ExtractMemberIdFromTokenAsync(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtPayloadBase64Url = token.Split('.')[1];
            var jwtPayloadBase64 = jwtPayloadBase64Url
                                    .Replace('-', '+')
                                    .Replace('_', '/')
                                    .PadRight(jwtPayloadBase64Url.Length + (4 - jwtPayloadBase64Url.Length % 4) % 4, '=');
            var jwtPayload = Encoding.UTF8.GetString(Convert.FromBase64String(jwtPayloadBase64));
            var jwtSecret = _config["JWT:SigningKey"];

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            SecurityToken validatedToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out validatedToken);
            var memberId = principal.FindFirst("member_id")?.Value;

            return memberId;
        }

        //public ClaimsPrincipal ValidateToken(string jwtToken)
        //{
        //    IdentityModelEventSource.ShowPII = true;

        //    var validationParameters = new TokenValidationParameters
        //    {
        //        ValidateLifetime = true,
        //        ValidAudience = _configuration["JWT:Issuer"],
        //        ValidIssuer = _configuration["JWT:Issuer"],
        //        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"]))
        //    };

        //    return new JwtSecurityTokenHandler().ValidateToken(jwtToken, validationParameters, out SecurityToken validatedToken);
        //}

        //public async Task<StaffInfoVM> GetStaffByIdAsync(string staffId)
        //{
        //    var staff = await _context.Staff.FindAsync(staffId);
        //    if (staff == null) return null;

        //    return new StaffInfoVM
        //    {
        //        Role = staff.Role,
        //        UserName = staff.Username,
        //        Email = staff.Email,
        //        FullName = staff.FullName,
        //        PhoneNumber = staff.Phone
        //    };
        //}

        //public async Task<List<StaffInfoVM>> GetAllStaffsAsync()
        //{
        //    var staff = await _context.Staff
        //                                .Select(m => new StaffInfoVM
        //                                {
        //                                    Role = m.Role,
        //                                    UserName = m.Username,
        //                                    Email = m.Email,
        //                                    FullName = m.FullName,
        //                                    PhoneNumber = m.Phone
        //                                })
        //                                .ToListAsync();
        //    return staff;
        //}

        //public async Task<bool> UpdateStaffAsync(string staffId, UpdateStaffRequest request)
        //{
        //    var staff = await _context.Staff.FindAsync(staffId);
        //    if (staff == null) return false;

        //    if (!string.IsNullOrEmpty(request.Password))
        //        staff.Password = request.Password;

        //    _context.Staff.Update(staff);
        //    await _context.SaveChangesAsync();

        //    return true;
        //}
        //public async Task<bool> DeleteStaffAsync(string staffId)
        //{
        //    var staff = await _context.Staff.FindAsync(staffId);
        //    if (staff == null) return false;

        //    _context.Staff.Remove(staff);
        //    await _context.SaveChangesAsync();

        //    return true;
        //}
    }
}
