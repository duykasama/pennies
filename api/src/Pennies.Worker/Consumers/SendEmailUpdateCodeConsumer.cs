using MailKit.Net.Smtp;
using MailKit.Security;
using MassTransit;
using Microsoft.Extensions.Options;
using MimeKit;
using Pennies.Messaging.Contracts;

namespace Pennies.Worker.Consumers;

public sealed class SendEmailUpdateCodeConsumer(
    IOptions<SmtpOptions> smtpOptions,
    ILogger<SendEmailUpdateCodeConsumer> logger)
    : IConsumer<SendEmailUpdateCodeEvent>
{
    public async Task Consume(ConsumeContext<SendEmailUpdateCodeEvent> context)
    {
        var opts = smtpOptions.Value;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Pennies", opts.From));
        message.To.Add(new MailboxAddress(string.Empty, context.Message.Email));
        message.Subject = "Your Pennies email update code";
        message.Body = new TextPart("html")
        {
            Text = $"<p>Your verification code is: <strong>{context.Message.Code}</strong>. It expires in {context.Message.ExpiryMinutes} minutes.</p>"
        };

        using var client = new SmtpClient();
        var secureSocketOptions = opts.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None;
        await client.ConnectAsync(opts.Host, opts.Port, secureSocketOptions, context.CancellationToken);
        if (!string.IsNullOrEmpty(opts.Username))
            await client.AuthenticateAsync(opts.Username, opts.Password, context.CancellationToken);
        await client.SendAsync(message, context.CancellationToken);
        await client.DisconnectAsync(quit: true, context.CancellationToken);

        logger.LogInformation("Email update code sent to {Email}", context.Message.Email);
    }
}
