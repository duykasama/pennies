using MailKit.Net.Smtp;
using MailKit.Security;
using MassTransit;
using Microsoft.Extensions.Options;
using MimeKit;
using Pennies.Messaging.Contracts;

namespace Pennies.Worker.Consumers;

public sealed class SendConfirmationEmailConsumer(
    IOptions<SmtpOptions> smtpOptions,
    ILogger<SendConfirmationEmailConsumer> logger)
    : IConsumer<SendConfirmationEmailEvent>
{
    public async Task Consume(ConsumeContext<SendConfirmationEmailEvent> context)
    {
        var opts = smtpOptions.Value;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Pennies", opts.From));
        message.To.Add(new MailboxAddress(string.Empty, context.Message.Email));
        message.Subject = "Confirm your Pennies account";
        message.Body = new TextPart("html")
        {
            Text = $"<p>Click <a href=\"{context.Message.ConfirmationLink}\">here</a> to confirm your email address.</p>"
        };

        using var client = new SmtpClient();
        var secureSocketOptions = opts.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None;
        await client.ConnectAsync(opts.Host, opts.Port, secureSocketOptions, context.CancellationToken);
        if (!string.IsNullOrEmpty(opts.Username))
            await client.AuthenticateAsync(opts.Username, opts.Password, context.CancellationToken);
        await client.SendAsync(message, context.CancellationToken);
        await client.DisconnectAsync(quit: true, context.CancellationToken);

        logger.LogInformation("Confirmation email sent to {Email}", context.Message.Email);
    }
}
