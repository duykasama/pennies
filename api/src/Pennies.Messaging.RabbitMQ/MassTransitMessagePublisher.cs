using MassTransit;

namespace Pennies.Messaging;

internal sealed class MassTransitMessagePublisher(IPublishEndpoint endpoint) : IMessagePublisher
{
    public Task PublishAsync<T>(T message, CancellationToken cancellationToken = default)
        where T : class => endpoint.Publish(message, cancellationToken);
}
