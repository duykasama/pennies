using Microsoft.AspNetCore.DataProtection;
using Pennies.Auth.Application.Services;
using System.Security.Cryptography;

namespace Pennies.Auth.Api.Services;

public sealed class EmailConfirmationTokenService(IDataProtectionProvider provider)
    : IEmailConfirmationTokenService
{
    private const char Separator = '|';
    private readonly IDataProtector _protector = provider.CreateProtector("EmailConfirmation");

    public string Protect(string userId, string identityToken) =>
        _protector.Protect($"{userId}{Separator}{identityToken}");

    public (string UserId, string IdentityToken) Unprotect(string token)
    {
        var payload = _protector.Unprotect(token);
        var index = payload.IndexOf(Separator);
        if (index < 0)
            throw new CryptographicException("Malformed token payload.");
        return (payload[..index], payload[(index + 1)..]);
    }
}
