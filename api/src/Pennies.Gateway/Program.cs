using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

var expensesUrl = builder.Configuration["services__pennies-expenses-api__http__0"];
var authUrl     = builder.Configuration["services__pennies-auth-api__http__0"];

builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// When running via Aspire, inject discovered URLs into Ocelot config (overrides hardcoded ports).
// Route 0 = expenses, Route 1 = auth — matches ocelot.json order.
if (expensesUrl is not null && authUrl is not null)
{
    var expensesUri = new Uri(expensesUrl);
    var authUri = new Uri(authUrl);
    builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?>
    {
        ["Routes:0:DownstreamScheme"]              = expensesUri.Scheme,
        ["Routes:0:DownstreamHostAndPorts:0:Host"] = expensesUri.Host,
        ["Routes:0:DownstreamHostAndPorts:0:Port"] = expensesUri.Port.ToString(),
        ["Routes:1:DownstreamScheme"]              = authUri.Scheme,
        ["Routes:1:DownstreamHostAndPorts:0:Host"] = authUri.Host,
        ["Routes:1:DownstreamHostAndPorts:0:Port"] = authUri.Port.ToString(),
    });
}

builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

app.MapDefaultEndpoints();

await app.UseOcelot();

app.Run();
