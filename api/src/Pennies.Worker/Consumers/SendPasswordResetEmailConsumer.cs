using MailKit.Net.Smtp;
using MailKit.Security;
using MassTransit;
using Microsoft.Extensions.Options;
using MimeKit;
using Pennies.Messaging.Contracts;

namespace Pennies.Worker.Consumers;

public sealed class SendPasswordResetEmailConsumer(
    IOptions<SmtpOptions> smtpOptions,
    ILogger<SendPasswordResetEmailConsumer> logger)
    : IConsumer<SendPasswordResetEmailEvent>
{
    public async Task Consume(ConsumeContext<SendPasswordResetEmailEvent> context)
    {
        var opts = smtpOptions.Value;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Pennies", opts.From));
        message.To.Add(new MailboxAddress(string.Empty, context.Message.Email));
        message.Subject = "Reset your Pennies password";
        message.Body = new TextPart("html")
        {
            Text = $"<p>Click <a href=\"{context.Message.ResetLink}\">here</a> to reset your password. This link expires in 1 hour.</p>"
        };

        using var client = new SmtpClient();
        var secureSocketOptions = opts.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None;
        await client.ConnectAsync(opts.Host, opts.Port, secureSocketOptions, context.CancellationToken);
        if (!string.IsNullOrEmpty(opts.Username))
            await client.AuthenticateAsync(opts.Username, opts.Password, context.CancellationToken);
        await client.SendAsync(message, context.CancellationToken);
        await client.DisconnectAsync(quit: true, context.CancellationToken);

        logger.LogInformation("Password reset email sent to {Email}", context.Message.Email);
    }
}
