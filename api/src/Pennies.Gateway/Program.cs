using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

var expensesUrl = builder.Configuration["services__pennies-expenses-api__http__0"] ?? "http://localhost:5100";
var authUrl     = builder.Configuration["services__pennies-auth-api__http__0"] ?? "http://localhost:5200";

Console.WriteLine("Expense: ", string.IsNullOrEmpty(expensesUrl.ToString()));
Console.WriteLine("Auth: ", string.IsNullOrEmpty(authUrl.ToString()));

//var expensesUri = new Uri(expensesUrl);
//var authUri = new Uri(authUrl);

builder.Configuration
    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

app.MapDefaultEndpoints();

await app.UseOcelot();

app.Run();
