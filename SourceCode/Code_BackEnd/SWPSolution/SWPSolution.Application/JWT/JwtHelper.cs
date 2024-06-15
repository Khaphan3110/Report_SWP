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

        public string ExtractMemberIdFromToken(string jwtToken, string jwtSecret, IConfiguration config)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtTokenBytes = Convert.FromBase64String(jwtToken.Split('.')[1]); // Get the payload part and decode from base64
            var jwtPayload = Encoding.UTF8.GetString(jwtTokenBytes);
            jwtSecret = _config["JWT:SigningKey"];

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            SecurityToken validatedToken;
            var principal = tokenHandler.ValidateToken(jwtToken, tokenValidationParameters, out validatedToken);

            // Extracting member_id claim from the token's payload
            var memberId = principal.FindFirst("member_id")?.Value;

            return memberId;
        }
    }
}
