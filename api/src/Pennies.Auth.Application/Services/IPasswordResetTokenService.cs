namespace Pennies.Auth.Application.Services;

public interface IPasswordResetTokenService
{
    string Protect(string userId, string identityToken);
    (string UserId, string IdentityToken) Unprotect(string token);
}
