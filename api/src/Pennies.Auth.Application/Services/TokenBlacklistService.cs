using Microsoft.Extensions.Caching.Distributed;

namespace Pennies.Auth.Application.Services;

public sealed class TokenBlacklistService(IDistributedCache cache)
{
    private static string Key(string jti) => $"blacklist:jti:{jti}";

    public Task BlacklistAsync(string jti, TimeSpan ttl, CancellationToken ct = default) =>
        cache.SetStringAsync(Key(jti), "1", new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = ttl,
        }, ct);

    public async Task<bool> IsBlacklistedAsync(string jti, CancellationToken ct = default) =>
        await cache.GetStringAsync(Key(jti), ct) is not null;
}
