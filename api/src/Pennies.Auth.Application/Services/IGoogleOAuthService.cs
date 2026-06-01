namespace Pennies.Auth.Application.Services;

public interface IGoogleOAuthService
{
    string BuildAuthorizationUrl(string redirectUri, string state);
    Task<GoogleUserInfo> ExchangeCodeAsync(string code, string redirectUri, CancellationToken ct = default);
}

public sealed record GoogleUserInfo(string GoogleUserId, string Email, string Name);
