using Microsoft.EntityFrameworkCore;
using Pennies.Auth.Application.Persistence;
using System.Text.Json;

var connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__pennies-auth")
    ?? ReadConnectionString("pennies-auth")
    ?? args.ElementAtOrDefault(0)
    ?? throw new InvalidOperationException("ConnectionStrings:pennies-auth is not configured");

var opts = new DbContextOptionsBuilder<AuthDbContext>()
    .UseNpgsql(connectionString, npgsql => npgsql.MigrationsAssembly("Pennies.Auth.Migrations"))
    .Options;

await using var db = new AuthDbContext(opts);
await db.Database.MigrateAsync();

static string? ReadConnectionString(string name)
{
    var path = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
    if (!File.Exists(path)) return null;
    try
    {
        using var doc = JsonDocument.Parse(File.ReadAllText(path));
        if (doc.RootElement.TryGetProperty("ConnectionStrings", out var cs) &&
            cs.TryGetProperty(name, out var val))
            return val.GetString();
    }
    catch { }
    return null;
}
