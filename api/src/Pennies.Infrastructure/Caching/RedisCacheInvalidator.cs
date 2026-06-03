using Pennies.Application.Common.Caching;
using StackExchange.Redis;

namespace Pennies.Infrastructure.Caching;

internal sealed class RedisCacheInvalidator(IConnectionMultiplexer multiplexer) : ICacheInvalidator
{
    public async Task InvalidateAsync(string pattern, CancellationToken cancellationToken = default)
    {
        var server = multiplexer.GetServers().First(s => s.IsConnected);
        var db = multiplexer.GetDatabase();

        await foreach (var key in server.KeysAsync(pattern: pattern))
            await db.KeyDeleteAsync(key);
    }
}
