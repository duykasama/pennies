namespace Pennies.Messaging.Contracts;

public sealed record SendEmailUpdateCodeEvent(string Email, string Code, int ExpiryMinutes);
