using MediatR;
using Microsoft.Extensions.Logging;

namespace Pennies.Application.Common.Behaviors;

public sealed class LoggingBehavior<TRequest, TResponse>(ILogger<TRequest> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var name = typeof(TRequest).Name;
        var start = DateTime.UtcNow;
        logger.LogInformation("[{Time:O}] Handling {RequestName}", start, name);
        var response = await next(cancellationToken);
        var elapsed = DateTime.UtcNow - start;
        logger.LogInformation("[{Time:O}] Handled {RequestName} in {ElapsedMs}ms", DateTime.UtcNow, name, elapsed.TotalMilliseconds);
        return response;
    }
}
