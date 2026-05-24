using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Pennies.Auth.Entities;

namespace Pennies.Auth.Services;

public sealed class JwtTokenService(IConfiguration configuration)
{
    public string GenerateAccessToken(AuthUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!));

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim("displayName", user.DisplayName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            ]),
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration["Jwt:Audience"],
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256),
        };

        return new JsonWebTokenHandler().CreateToken(descriptor);
    }
}
