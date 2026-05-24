namespace Pennies.Auth.Services;

public sealed class EmailService
{
    public Task SendEmailConfirmationAsync(string email, string confirmationLink, CancellationToken cancellationToken = default)
    {
        // TODO: wire up SMTP or SendGrid
        return Task.CompletedTask;
    }
}
