using MassTransit;
using Pennies.Messaging.Contracts;

namespace Pennies.Worker.Consumers;

public sealed class ExpenseCreatedConsumer(ILogger<ExpenseCreatedConsumer> logger)
    : IConsumer<ExpenseCreatedEvent>
{
    public Task Consume(ConsumeContext<ExpenseCreatedEvent> context)
    {
        logger.LogInformation(
            "Expense created: {ExpenseId} by user {UserId} for {Amount}",
            context.Message.ExpenseId,
            context.Message.UserId,
            context.Message.Amount);

        return Task.CompletedTask;
    }
}
