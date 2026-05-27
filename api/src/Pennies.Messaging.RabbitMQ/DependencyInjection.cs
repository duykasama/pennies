using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Pennies.Messaging;

public static class DependencyInjection
{
    public static IServiceCollection AddMessaging(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddMassTransit(x =>
        {
            x.UsingRabbitMq((_, cfg) => cfg.Host(new Uri(connectionString)));
        });

        services.AddScoped<IMessagePublisher, MassTransitMessagePublisher>();

        return services;
    }
}
