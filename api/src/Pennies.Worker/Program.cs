using MassTransit;
using Pennies.Worker;
using Pennies.Worker.Consumers;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();

builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));

// When running under Aspire, override SMTP host/port from the Mailpit connection string.
// Format injected by Aspire: "Endpoint=smtp://host:port"
var mailpitCs = builder.Configuration.GetConnectionString("mailpit");
if (mailpitCs is not null)
{
    var smtpUri = new Uri(mailpitCs.Split('=', 2)[1]);
    builder.Services.PostConfigure<SmtpOptions>(opts =>
    {
        opts.Host = smtpUri.Host;
        opts.Port = smtpUri.Port;
        opts.UseSsl = false;
    });
}

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<ExpenseCreatedConsumer>();
    x.AddConsumer<SendConfirmationEmailConsumer>();
    x.AddConsumer<SendPasswordResetEmailConsumer>();
    x.AddConsumer<SendEmailUpdateCodeConsumer>();

    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(new Uri(builder.Configuration.GetConnectionString("rabbitmq")!));

        cfg.ReceiveEndpoint("expense-created", e =>
        {
            e.UseMessageRetry(r =>
                r.Exponential(
                    retryLimit: 5,
                    minInterval: TimeSpan.FromSeconds(1),
                    maxInterval: TimeSpan.FromMinutes(1),
                    intervalDelta: TimeSpan.FromSeconds(5)));

            e.ConfigureConsumer<ExpenseCreatedConsumer>(ctx);
        });

        cfg.ReceiveEndpoint("send-confirmation-email", e =>
        {
            e.UseMessageRetry(r =>
                r.Exponential(
                    retryLimit: 5,
                    minInterval: TimeSpan.FromSeconds(1),
                    maxInterval: TimeSpan.FromMinutes(1),
                    intervalDelta: TimeSpan.FromSeconds(5)));

            e.ConfigureConsumer<SendConfirmationEmailConsumer>(ctx);
        });

        cfg.ReceiveEndpoint("send-password-reset-email", e =>
        {
            e.UseMessageRetry(r =>
                r.Exponential(
                    retryLimit: 5,
                    minInterval: TimeSpan.FromSeconds(1),
                    maxInterval: TimeSpan.FromMinutes(1),
                    intervalDelta: TimeSpan.FromSeconds(5)));

            e.ConfigureConsumer<SendPasswordResetEmailConsumer>(ctx);
        });

        cfg.ReceiveEndpoint("send-email-update-code", e =>
        {
            e.UseMessageRetry(r =>
                r.Exponential(
                    retryLimit: 5,
                    minInterval: TimeSpan.FromSeconds(1),
                    maxInterval: TimeSpan.FromMinutes(1),
                    intervalDelta: TimeSpan.FromSeconds(5)));

            e.ConfigureConsumer<SendEmailUpdateCodeConsumer>(ctx);
        });
    });
});

var app = builder.Build();
app.Run();
