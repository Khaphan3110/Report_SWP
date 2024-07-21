using System.Configuration;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NETCore.MailKit.Core;
using SWPSolution.Application.Catalog.Categories;
using SWPSolution.Application.Catalog.Product;
using SWPSolution.Application.Common;
using SWPSolution.Application.AppPayment;
using SWPSolution.Application.AppPayment.VNPay;
using SWPSolution.Application.Sales;
using SWPSolution.Application.Session;
using SWPSolution.Application.System.Admin;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Payment;
using SWPSolution.ViewModels.System.Users;
using EmailService = SWPSolution.Application.System.User.EmailService;
using IEmailService = SWPSolution.Application.System.User.IEmailService;
using SWPSolution.Application.Catalog.Promotion;
using SWPSolution.BackendApi.Chat;

namespace SWPSolution.BackendApi
{
    public class Program
    {
        public static void Main(string[] args)
        {

            var builder = WebApplication.CreateBuilder(args);
            //     {
            //         ContentRootPath = "/home/norman/SWP/net8.0/publish",
            //        WebRootPath = "/home/norman/SWP/net8.0/publish/wwwroot"
            //   };

            builder.Services.AddControllers();

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenAnyIP(5000); // Replace 5000 with your desired port
            });


            builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();

            //Add cros 
            builder.Services.AddCors(p => p.AddPolicy("SWP_GROUP2", build =>
            {

                build.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials(); ;

            }));

            //Add DbContext
            builder.Services.AddDbContext<SWPSolutionDBContext>();
            builder.Services.Configure<DataProtectionTokenProviderOptions>(opts => opts.TokenLifespan = TimeSpan.FromHours(1));
            //Declare DI 
            builder.Services.AddTransient<IPublicProductService, PublicProductService>();
            builder.Services.AddTransient<UserManager<AppUser>, UserManager<AppUser>>();
            builder.Services.AddTransient<SignInManager<AppUser>, SignInManager<AppUser>>();
            builder.Services.AddTransient<RoleManager<AppRole>, RoleManager<AppRole>>();
            builder.Services.AddTransient<IUserService, UserService>();
            builder.Services.AddTransient<IManageProductService, ManageProductService>();
            builder.Services.AddSingleton<IStorageService, FileStorageService>();
            builder.Services.AddTransient<ICategoryService, CategoryService>();
            builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            builder.Services.AddTransient<IUrlHelperFactory, UrlHelperFactory>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddScoped<IPreOrderService, PreOrderService>();
            builder.Services.AddHostedService<PreOrderCheckAndNotifyService>();
            builder.Services.AddSignalR();
            builder.Services.AddIdentity<AppUser, AppRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
            })
    .AddEntityFrameworkStores<SWPSolutionDBContext>()
    .AddDefaultTokenProviders();

            builder.Services.AddDistributedMemoryCache(); // Use in-memory cache for session storage (can be replaced with other providers)
            builder.Services.AddSession(options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.Strict;
            });
            builder.Services.AddScoped<ISessionService, SessionService>();

            //Add email configs
            var emailConfig = builder.Configuration.GetSection("EmailConfiguration").Get<EmailVM>();
            builder.Services.AddSingleton(emailConfig);
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IAdminService, AdminService>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddSingleton<IVnPayService, VnPayService>();
            builder.Services.AddScoped<IPromotionService, PromotionService>();


            //Add config for required email
            builder.Services.Configure<IdentityOptions>(opts =>
                opts.SignIn.RequireConfirmedEmail = true
            );
            //Add Authentication


            string signingKey = builder.Configuration.GetValue<string>("JWT:SigningKey");
            byte[] signingKeyBytes = System.Text.Encoding.UTF8.GetBytes(signingKey);
            builder.Services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["JWT:Issuer"],
                    ValidAudience = builder.Configuration["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(signingKeyBytes)
                };
            });
            // Add services to the container.
            builder.Services.AddControllersWithViews();
            builder.Services.AddControllers().AddFluentValidation();
            // Add Swagger services
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(option =>
            {
                option.MapType<string>(() => new OpenApiSchema { Type = "" });
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Auth API", Version = "v1" });

                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {

                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();
                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                    c.RoutePrefix = string.Empty;  // Set Swagger UI at the root of the application
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseCors("SWP_GROUP2");
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseSession();
            app.MapControllerRoute(
                            name: "default",
                            pattern: "{controller=Home}/{action=Index}/{id?}");
            app.MapHub<ChatHub>("/chathub");
            app.Run();
        }
    }
}