using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pennies.Application.Common.Caching;

namespace Pennies.Application.Common.Behaviors;

public sealed class CachingBehavior<TRequest, TResponse>(
    IDistributedCache cache,
    IOptions<CacheSettings> settings,
    ILogger<CachingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        Converters = { new ResultJsonConverterFactory() }
    };

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (request is not ICacheableQuery cacheableRequest)
            return await next(cancellationToken);

        var key = cacheableRequest.CacheKey;
        var cached = await cache.GetAsync(key, cancellationToken);

        if (cached is not null)
        {
            logger.LogDebug("[{Time:O}] Cache HIT for {CacheKey}", DateTime.UtcNow, key);
            return JsonSerializer.Deserialize<TResponse>(cached, JsonOptions)!;
        }

        logger.LogDebug("[{Time:O}] Cache MISS for {CacheKey}", DateTime.UtcNow, key);
        var response = await next(cancellationToken);

        var expiration = cacheableRequest.Expiration
            ?? TimeSpan.FromMinutes(settings.Value.ExpirationMinutes);

        await cache.SetAsync(
            key,
            JsonSerializer.SerializeToUtf8Bytes(response, JsonOptions),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = expiration },
            cancellationToken);

        return response;
    }
}
