namespace Pennies.Application.Common.Caching;

public sealed class CacheSettings
{
    public const string SectionName = "CacheSettings";
    public int ExpirationMinutes { get; init; } = 5;
}
