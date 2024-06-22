using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Sales
{
    public class OrderService : IOrderService
    {
        private readonly SWPSolutionDBContext _context;
        private readonly IConfiguration _config;

        public OrderService(SWPSolutionDBContext context, IConfiguration configuration)
        {
            _config = configuration;
            _context = context;
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

        public Task<bool> PlaceOrderAsync(OrderRequest orderRequest)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> AddReview(string memberId, AddReviewRequest request)
        {
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return false;

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null) return false;

            var review = new Review
            {
                DataReview = DateTime.Now,
                Grade = request.Grade,
                Comment = request.Comment,
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteReview(string memberId, string productId)
        {
            var review = _context.Reviews.FirstOrDefault(r => r.MemberId == memberId && r.ProductId == productId);
            if (review == null)
                return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return true;
        }


    }
}
