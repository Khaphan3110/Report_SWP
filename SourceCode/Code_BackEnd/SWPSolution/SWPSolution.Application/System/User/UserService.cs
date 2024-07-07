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
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Logging;
using System.Linq;


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
            var user =  _userManager.Users.FirstOrDefault(u => u.EmailVerificationCode == otp && u.EmailVerificationExpiry > DateTime.Now);
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
                Id = Guid.NewGuid(),
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
            var members =  _context.Members
                                        .Select(m => new MemberInfoVM
                                        {
                                            MemberId = m.MemberId,
                                            UserName = m.UserName,
                                            Password = m.PassWord,
                                            Email = m.Email,
                                            FirstName = m.FirstName,
                                            LastName = m.LastName,
                                            PhoneNumber = m.PhoneNumber,
                                            LoyaltyPoints = m.LoyaltyPoints,
                                            RegistrationDate = m.RegistrationDate,

                                        })
                                        .ToList();
            return members;
        }

        public async Task<MemberInfoVM> GetMemberByIdAsync(string memberId)
        {
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return null;

            return new MemberInfoVM
            {
                MemberId = member.MemberId,
                UserName = member.UserName,
                Password = member.PassWord,
                Email = member.Email,
                FirstName = member.FirstName,
                LastName = member.LastName,
                PhoneNumber = member.PhoneNumber,
                LoyaltyPoints = member.LoyaltyPoints,
                RegistrationDate = member.RegistrationDate,
            };
        }

        public async Task<MemberInfoVM> GetMemberByMailAsync(string email)
        {
            var member = await _context.Members.FindAsync(email);
            if (member == null) return null;

            return new MemberInfoVM
            {
                MemberId = member.MemberId,
                UserName = member.UserName,
                Email = member.Email,
                FirstName = member.FirstName,
                LastName = member.LastName,
                PhoneNumber = member.PhoneNumber,
                RegistrationDate = member.RegistrationDate,
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
        public async Task<List<MemberAddressVM>> GetMemberAddressById(string id)
        {
            var address = _context.Addresses
                                        .Where(m => m.MemberId == id || m.AddressId == id)
                                        .Select(m => new MemberAddressVM
                                        {
                                            Id = m.AddressId,
                                            House_Number = m.HouseNumber,
                                            Street_Name = m.Street,
                                            District_Name = m.District,
                                            City = m.City,
                                            Region = m.Region
                                        })
                                        .ToList();

            if (!address.Any())
            {
                throw new KeyNotFoundException($"Address not found.");
            }

            return address;
        }

        public async Task<List<MemberAddressVM>> GetAllAddresses()
        {
            var address = _context.Addresses
                                        .Select(m => new MemberAddressVM
                                        {
                                            Id = m.AddressId,
                                            House_Number = m.HouseNumber,
                                            Street_Name = m.Street,
                                            District_Name = m.District,
                                            City = m.City,
                                            Region = m.Region
                                        })
                                        .ToList();
            return address;
        }

        public async Task<bool> UpdateMemberAddress(string id, UpdateAddressRequest request)
        {
            var address = _context.Addresses.FirstOrDefault(a => a.MemberId == id || a.AddressId == id);
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
            var address = _context.Addresses.FirstOrDefault(a => a.MemberId == id || a.AddressId == id);
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

        //Staff stuffs
        public async Task<string> AuthenticateStaff(LoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null)
            {
                return null; 
            }

            var result = await _signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, true);
            if (!result.Succeeded)
            {
                return null;
            }

            string staffId = await GetStaffIdByUsername(request.UserName);

            var getRoles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Name, request.UserName),
                new Claim("staff_id", staffId.ToString())  
            };

            foreach (var role in getRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

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

        public async Task<string> ExtractStaffIdFromTokenAsync(string token)
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
            var staffId = principal.FindFirst("staff_id")?.Value;

            return staffId;
        }

        private async Task<string> GetStaffIdByUsername(string username)
        {
            var staff = _context.Staff.FirstOrDefault(m => m.Username == username);
            if (staff != null)
            {
                return staff.StaffId;
            }
            else
            {
                throw new SWPException("Error getting Staff ID");
            }
        }

        public async Task<bool> RegisterStaff(List<RegisterRequest> requests)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var request in requests)
                {
                    var user = new AppUser
                    {
                        Id = Guid.NewGuid(),
                        Email = request.Email,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        PhoneNumber = request.PhoneNumber,
                        UserName = request.UserName,
                        TemporaryPassword = request.Password,
                        EmailConfirmed = true,
                    };

                    var result = await _userManager.CreateAsync(user, request.Password);

                    if (result.Succeeded)
                    {
                        // Ensure the Staff role exists
                        if (!await _roleManager.RoleExistsAsync("staffmember"))
                        {
                            var staffRole = new AppRole {Id = Guid.NewGuid(), Name = "staffmember", Description = "Staff role with many permissions" };
                            await _roleManager.CreateAsync(staffRole);
                        }

                        // Assign the Staff role to the user
                        await _userManager.AddToRoleAsync(user, "staffmember");

                        // Generate staff ID
                        string generatedId = GenerateStaffId();

                        var staff = new Staff
                        {
                            StaffId = generatedId,
                            Role = "staffmember",
                            Username = request.UserName,
                            Password = request.Password,
                            FullName = $"{request.FirstName} {request.LastName}",
                            Email = request.Email,
                            Phone = request.PhoneNumber,                           
                        };

                        _context.Staff.Add(staff);
                    }
                    else
                    {
                        // Rollback transaction if user creation fails
                        await transaction.RollbackAsync();
                        return false;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Rollback transaction in case of exception
                await transaction.RollbackAsync();
                throw;
            }
        }

        private string GenerateStaffId()
        {
            // Generate categories_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"SM{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextAutoIncrement(string month, string year)
        {
            // Generate the pattern for categories_ID to match in SQL query
            string pattern = $"SM{month}{year}";

            // Retrieve the maximum auto-increment value from existing categories for the given month and year
            var maxAutoIncrement = _context.Staff
                .Where(c => c.StaffId.StartsWith(pattern))
                .Select(c => c.StaffId.Substring(6, 3)) // Select substring of auto-increment part
                .AsEnumerable() // Switch to client evaluation from this point
                .Select(s => int.Parse(s)) // Parse string to int
                .DefaultIfEmpty(0)
                .Max();

            return maxAutoIncrement + 1;
        }

        public async Task<StaffInfoVM> GetStaffById(string staffId)
        {
            var staff = _context.Staff.Find(staffId);
            if (staff == null) return null;

            return new StaffInfoVM
            {
                Id = staffId,
                Role = staff.Role,
                UserName = staff.Username,
                Password = staff.Password,
                Email = staff.Email,
                FullName = staff.FullName,
                PhoneNumber = staff.Phone
            };
        }

        public async Task<List<StaffInfoVM>> GetAllStaffs()
        {
            var staff = _context.Staff
                                        .Select(m => new StaffInfoVM
                                        {
                                            Id = m.StaffId,
                                            Role = m.Role,
                                            UserName = m.Username,
                                            Password = m.Password,
                                            Email = m.Email,
                                            FullName = m.FullName,
                                            PhoneNumber = m.Phone
                                        })
                                        .ToList();
            return staff;
        }

        public async Task<bool> UpdateStaff(string id, UpdateStaffRequest request)
        {
            // Find the user by id
            var staff = _context.Staff.Find(id);
            if (staff == null)
            {
                return false;
            }

            // Update staff password 
            if (!string.IsNullOrEmpty(request.Password))
            {
                staff.Password = request.Password;
            }
            _context.Staff.Update(staff);

            // Update AppUser
            var user = await _userManager.FindByNameAsync(staff.Username);
            if (user != null && !string.IsNullOrEmpty(request.Password))
            {
                // Reset the user's password using the provided password
                if (!string.IsNullOrEmpty(request.Password))
                {
                    var result = await _userManager.RemovePasswordAsync(user);
                    if (result.Succeeded)
                    {
                        result = await _userManager.AddPasswordAsync(user, request.Password);
                        if (!result.Succeeded)
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                    user.TemporaryPassword = request.Password;
                }
                var userUpdateResult = await _userManager.UpdateAsync(user);
                if (!userUpdateResult.Succeeded)
                {
                    return false;
                }
            }

            // Save all changes in one transaction
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ResetStaffPassword(string Email)
        {
            var user = await _userManager.FindByEmailAsync(Email);
            if (user == null)
                return false;

            var otpSent = await SendOtp(Email);

            return true; 
        }

        public async Task<bool> ConfirmStaff(string otp, UpdateStaffRequest request)
        {
            var user = _userManager.Users.FirstOrDefault(u => u.EmailVerificationCode == otp && u.EmailVerificationExpiry > DateTime.Now);
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

                var staff = _context.Staff.FirstOrDefault(s => s.Email == user.Email);
                if (staff == null)
                {
                    return false;
                }

                // Update staff password 
                if (!string.IsNullOrEmpty(request.Password))
                {
                    staff.Password = request.Password;
                }
                _context.Staff.Update(staff);

                //Update AppUser
                if (!string.IsNullOrEmpty(request.Password))
                {
                    var results = await _userManager.RemovePasswordAsync(user);
                    if (results.Succeeded)
                    {
                        result = await _userManager.AddPasswordAsync(user, request.Password);
                        if (!results.Succeeded)
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                    user.TemporaryPassword = request.Password;
                }
                var userUpdateResult = await _userManager.UpdateAsync(user);
                if (!userUpdateResult.Succeeded)
                {
                    return false;
                }
                //Save all changes in one transaction
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

        public async Task<bool> DeleteStaff(string staffId)
        {
            var staff = _context.Staff.Find(staffId);
            if (staff == null) return false;

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<PageResult<MemberInfoVM>> GetUsersPaging(GetUserPagingRequest request)
        {
            var query = _context.Members.AsQueryable();

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(x => x.UserName.Contains(request.Keyword));
            }

            int totalRow = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new MemberInfoVM()
                {
                    MemberId = c.MemberId,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    PhoneNumber = c.PhoneNumber,
                    UserName = c.UserName,
                    Email = c.Email,
                }).ToListAsync();

            var pageResult = new PageResult<MemberInfoVM>
            {
                TotalRecords = totalRow,
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                Items = data,
            };
            return pageResult;
        }

		public async Task<ApiResult<MemberInfoVM>> GetUserIdPaging(string id)
		{
			var user = await _context.Members.FindAsync(id);
			if (user == null)
			{
				return new ApiErrorResult<MemberInfoVM>("User not exist");
			}

			var userVm = new MemberInfoVM()
			{
                MemberId = id,
                Email = user.Email,
				PhoneNumber = user.PhoneNumber,
				FirstName = user.FirstName,
				LastName = user.LastName,
				UserName = user.UserName,
			};
			return new ApiSuccessResult<MemberInfoVM>(userVm);
		}

        public async Task<PageResult<StaffInfoVM>> GetStaffsPaging(GetUserPagingRequest request)
        {
            var query = _context.Staff.AsQueryable();

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(x => x.Username.Contains(request.Keyword) && x.Role == "staffmember");
            }
            else
            {
                query = query.Where(x => x.Role == "staffmember");
            }

            int totalRow = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new StaffInfoVM()
                {
                    Id = c.StaffId,
                    Role = c.Role,
                    UserName = c.Username,
                    Password = c.Password,
                    FullName = c.FullName,
                    Email = c.Email,
                    PhoneNumber = c.Phone,
                }).ToListAsync();

            var pageResult = new PageResult<StaffInfoVM>
            {
                TotalRecords = totalRow,
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                Items = data,
            };
            return pageResult;
        }

        public async Task<ApiResult<StaffInfoVM>> GetStaffIdPaging(string id)
        {
            var user = await _context.Staff.FindAsync(id);
            if (user == null)
            {
                return new ApiErrorResult<StaffInfoVM>("Staff not exist");
            }

            var userVm = new StaffInfoVM()
            {
                Id = id,
                UserName = user.Username,
                Password = user.Password,
                FullName =user.FullName,
                Email = user.Email,
                PhoneNumber = user.Phone,
            };
            return new ApiSuccessResult<StaffInfoVM>(userVm);
        }
    }
}
