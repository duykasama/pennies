namespace Pennies.Messaging.Contracts;

public sealed record ExpenseCreatedEvent(Guid ExpenseId, string UserId, decimal Amount, DateOnly Date);
