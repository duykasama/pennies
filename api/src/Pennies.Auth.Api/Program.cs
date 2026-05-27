using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pennies.Auth.Application;
using Pennies.Auth.Application.Common.Behaviors;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Persistence;
using Pennies.Auth.Application.Services;
using Pennies.Auth.Api.Endpoints;
using Pennies.Auth.Api.Middleware;
using Pennies.Auth.Api.Services;
using Pennies.Messaging;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AuthDbContext>(opts =>
    opts.UseNpgsql(
        builder.Configuration.GetConnectionString("pennies-auth"),
        npgsql => npgsql.MigrationsAssembly("Pennies.Auth.Migrations")));

builder.Services.AddIdentity<AuthUser, IdentityRole>(opts =>
{
    opts.Password.RequiredLength = 8;
    opts.User.RequireUniqueEmail = true;
    opts.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<AuthDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(AssemblyMarker).Assembly);
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});
builder.Services.AddValidatorsFromAssembly(typeof(AssemblyMarker).Assembly);

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<IEmailConfirmationTokenService, EmailConfirmationTokenService>();
builder.Services.AddMessaging(builder.Configuration.GetConnectionString("rabbitmq")!);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapAuthEndpoints();
app.MapDefaultEndpoints();

app.Run();
