namespace Pennies.Messaging.Contracts;

public sealed record SendPasswordResetEmailEvent(string Email, string ResetLink);
