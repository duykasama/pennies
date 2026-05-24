using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pennies.Auth.Endpoints;
using Pennies.Auth.Entities;
using Pennies.Auth.Middleware;
using Pennies.Auth.Persistence;
using Pennies.Auth.Services;
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

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<EmailService>();

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
