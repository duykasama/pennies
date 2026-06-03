using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Pennies.Application.Common.Caching;
using Pennies.Domain.Expenses;
using Pennies.Infrastructure.Caching;
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

    public static IHostApplicationBuilder AddCaching(this IHostApplicationBuilder builder)
    {
        builder.Services.Configure<CacheSettings>(
            builder.Configuration.GetSection(CacheSettings.SectionName));

        builder.AddRedisClient("redis");
        builder.AddRedisDistributedCache("redis");

        builder.Services.AddScoped<ICacheInvalidator, RedisCacheInvalidator>();

        return builder;
    }
}
