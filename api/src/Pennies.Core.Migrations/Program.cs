using DbUp;
using System.Reflection;
using System.Text.Json;

var connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__pennies")
    ?? ReadConnectionString("pennies")
    ?? args.ElementAtOrDefault(0)
    ?? throw new InvalidOperationException("ConnectionStrings:pennies is not configured");

EnsureDatabase.For.PostgresqlDatabase(connectionString);

var result = DeployChanges.To
    .PostgresqlDatabase(connectionString)
    .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
    .LogToConsole()
    .Build()
    .PerformUpgrade();

if (!result.Successful)
{
    Console.Error.WriteLine($"Migration failed: {result.Error}");
    Environment.Exit(1);
}

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
