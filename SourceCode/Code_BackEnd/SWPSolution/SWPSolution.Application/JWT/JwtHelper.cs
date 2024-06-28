using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.JWT
{
    public class JwtHelper
    {
        private readonly IConfiguration _config;

        public async Task<string> ExtractMemberIdFromTokenAsync(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtTokenBytes = Convert.FromBase64String(token.Split('.')[1]);
            var jwtPayload = Encoding.UTF8.GetString(jwtTokenBytes);
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

            return await Task.FromResult(memberId);
        }
    }
}
