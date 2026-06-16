namespace Pennies.Auth.Application.Common;

public sealed class EmailUpdateSettings
{
    public const string SectionName = "EmailUpdate";
    public int CodeExpiryMinutes { get; init; } = 10;
}
