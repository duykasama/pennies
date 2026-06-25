using System.Security.Claims;
using System.Text;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pennies.Auth.Application;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Common.Behaviors;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Persistence;
using Pennies.Auth.Application.Services;
using Pennies.Auth.Application.Settings;
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
builder.Services.AddSingleton<TokenBlacklistService>();
builder.Services.AddScoped<IEmailConfirmationTokenService, EmailConfirmationTokenService>();
builder.Services.Configure<GoogleAuthSettings>(builder.Configuration.GetSection(GoogleAuthSettings.SectionName));
builder.Services.AddHttpClient<IGoogleOAuthService, GoogleOAuthService>();
builder.Services.AddScoped<IPasswordResetTokenService, PasswordResetTokenService>();
builder.Services.Configure<EmailUpdateSettings>(builder.Configuration.GetSection(EmailUpdateSettings.SectionName));
builder.Services.AddMessaging(builder.Configuration.GetConnectionString("rabbitmq")!);

if (builder.Configuration.GetConnectionString("redis") is not null)
    builder.AddRedisDistributedCache("redis");
else
    builder.Services.AddDistributedMemoryCache();

builder.Services.AddAuthentication()
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
        };
        opts.Events = new JwtBearerEvents
        {
            OnTokenValidated = async ctx =>
            {
                var jti = ctx.Principal?.FindFirstValue("jti");
                if (jti is not null)
                {
                    var blacklist = ctx.HttpContext.RequestServices.GetRequiredService<TokenBlacklistService>();
                    if (await blacklist.IsBlacklistedAsync(jti, ctx.HttpContext.RequestAborted))
                        ctx.Fail("Token has been revoked.");
                }
            }
        };
    });
// AddIdentity sets DefaultAuthenticateScheme/DefaultChallengeScheme to its cookie scheme.
// PostConfigure runs after all Configure calls, overriding them to JWT Bearer.
builder.Services.PostConfigure<AuthenticationOptions>(opts =>
{
    opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
});
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapDefaultEndpoints();

app.Run();
