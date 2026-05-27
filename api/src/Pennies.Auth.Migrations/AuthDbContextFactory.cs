using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Pennies.Auth.Application.Persistence;

namespace Pennies.Auth.Migrations;

public class AuthDbContextFactory : IDesignTimeDbContextFactory<AuthDbContext>
{
    public AuthDbContext CreateDbContext(string[] args)
    {
        var opts = new DbContextOptionsBuilder<AuthDbContext>()
            .UseNpgsql(
                "Host=localhost;Database=pennies_auth;Username=postgres;Password=postgres",
                npgsql => npgsql.MigrationsAssembly("Pennies.Auth.Migrations"))
            .Options;

        return new AuthDbContext(opts);
    }
}
