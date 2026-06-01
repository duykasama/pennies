using System.Net.Http.Json;
using System.Web;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using Pennies.Auth.Application.Settings;

namespace Pennies.Auth.Application.Services;

public sealed class GoogleOAuthService(
    HttpClient httpClient,
    IOptions<GoogleAuthSettings> settings)
    : IGoogleOAuthService
{
    private const string AuthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    private const string TokenEndpoint = "https://oauth2.googleapis.com/token";

    public string BuildAuthorizationUrl(string redirectUri, string state)
    {
        var qs = HttpUtility.ParseQueryString(string.Empty);
        qs["client_id"] = settings.Value.ClientId;
        qs["redirect_uri"] = redirectUri;
        qs["response_type"] = "code";
        qs["scope"] = "openid email profile";
        qs["access_type"] = "offline";
        qs["state"] = state;
        return $"{AuthEndpoint}?{qs}";
    }

    public async Task<GoogleUserInfo> ExchangeCodeAsync(string code, string redirectUri, CancellationToken ct = default)
    {
        var tokenResponse = await httpClient.PostAsync(
            TokenEndpoint,
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = settings.Value.ClientId,
                ["client_secret"] = settings.Value.ClientSecret,
                ["redirect_uri"] = redirectUri,
                ["grant_type"] = "authorization_code",
            }),
            ct);

        tokenResponse.EnsureSuccessStatusCode();

        var tokenData = await tokenResponse.Content.ReadFromJsonAsync<GoogleTokenResponse>(cancellationToken: ct)
            ?? throw new InvalidOperationException("Empty token response from Google.");

        var payload = await GoogleJsonWebSignature.ValidateAsync(
            tokenData.IdToken,
            new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [settings.Value.ClientId],
            });

        return new GoogleUserInfo(payload.Subject, payload.Email, payload.Name);
    }

    private sealed record GoogleTokenResponse(
        [property: System.Text.Json.Serialization.JsonPropertyName("id_token")]
        string IdToken);
}
