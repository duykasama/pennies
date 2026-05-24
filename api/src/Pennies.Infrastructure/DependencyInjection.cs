using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pennies.Domain.Expenses;
using Pennies.Infrastructure.Persistence;
using Pennies.Infrastructure.Persistence.Repositories;

namespace Pennies.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(opts =>
            opts.UseNpgsql(configuration.GetConnectionString("pennies")));

        services.AddScoped<IExpenseRepository, ExpenseRepository>();

        return services;
    }
}
