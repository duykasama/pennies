using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Pennies.Auth.Application.Entities;

namespace Pennies.Auth.Application.Services;

public sealed class JwtTokenService(IConfiguration configuration)
{
    public string? TryExtractJti(string accessToken)
    {
        try { return new JsonWebToken(accessToken).GetPayloadValue<string>(JwtRegisteredClaimNames.Jti); }
        catch { return null; }
    }

    public DateTime? TryExtractExpiry(string accessToken)
    {
        try
        {
            var exp = new JsonWebToken(accessToken).GetPayloadValue<long>(JwtRegisteredClaimNames.Exp);
            return DateTimeOffset.FromUnixTimeSeconds(exp).UtcDateTime;
        }
        catch { return null; }
    }

    public string GenerateRefreshToken()
    {
        var bytes = System.Security.Cryptography.RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

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
