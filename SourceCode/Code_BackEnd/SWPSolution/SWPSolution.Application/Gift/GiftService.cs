using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Gift;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Gift
{
    public class GiftService : IGiftService
    {
        private readonly SWPSolutionDBContext _context;
        private readonly IConfiguration _config;

        public GiftService(SWPSolutionDBContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<GiftPurchase> PurchaseGiftAsync(GiftPurchaseRequest request)
        {
            string memberId = await ExtractMemberIdFromTokenAsync(request.Token);
            var member = await _context.Members.FindAsync(memberId);
            if (member == null)
            {
                throw new Exception("Member not found");
            }

            var gift = await _context.Gifts.FindAsync(request.GiftId);
            if (gift == null)
            {
                throw new Exception("Gift not found");
            }

            if (member.LoyaltyPoints < gift.RequiredPoints)
            {
                throw new Exception("Not enough loyalty points to purchase the gift.");
            }

            member.LoyaltyPoints -= gift.RequiredPoints;

            var giftPurchase = new GiftPurchase
            {
                MemberId = memberId,
                GiftId = request.GiftId,
                PurchaseDate = DateTime.UtcNow
            };
            _context.GiftPurchases.Add(giftPurchase);

            await _context.SaveChangesAsync();

            await SendReceiptEmailAsync(memberId, giftPurchase);

            return giftPurchase;
        }

        private async Task<string> ExtractMemberIdFromTokenAsync(string token)
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

        private async Task SendReceiptEmailAsync(string memberId, GiftPurchase giftPurchase)
        {
            var emailConfig = _config.GetSection("EmailConfiguration").Get<EmailVM>();
            var emailService = new EmailService(emailConfig);

            var member = await _context.Members.FindAsync(memberId);
            if (member == null)
            {
                throw new Exception("Member not found");
            }

            var gift = await _context.Gifts.FindAsync(giftPurchase.GiftId);
            if (gift == null)
            {
                throw new Exception("Gift not found");
            }

            var emailBody = $@"
            <h1>Gift Purchase Receipt</h1>
            <p>Thank you for using your loyalty points to purchase a gift!</p>
            <p>Gift Name: {gift.GiftName}</p>
            <p>Points Used: {gift.RequiredPoints}</p>
            <p>Purchase Date: {giftPurchase.PurchaseDate}</p>";

            var message = new MessageVM(
                new List<string> { member.Email },
                "Gift Purchase Receipt",
                emailBody
            );

            emailService.SendEmail(message);
        }
    }

}
