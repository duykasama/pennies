namespace Pennies.Messaging.Contracts;

public sealed record SendConfirmationEmailEvent(string Email, string ConfirmationLink);
