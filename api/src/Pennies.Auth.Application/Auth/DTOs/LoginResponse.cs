namespace Pennies.Auth.Application.Auth.DTOs;

public sealed record LoginResponse(string AccessToken, DateTime ExpiresAt);
