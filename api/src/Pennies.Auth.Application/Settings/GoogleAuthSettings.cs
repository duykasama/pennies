namespace Pennies.Auth.Application.Settings;

public sealed class GoogleAuthSettings
{
    public const string SectionName = "Google";
    public required string ClientId { get; init; }
    public required string ClientSecret { get; init; }
}
