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
        logger.LogInformation("Handling {RequestName}", name);
        var response = await next(cancellationToken);
        logger.LogInformation("Handled {RequestName}", name);
        return response;
    }
}
