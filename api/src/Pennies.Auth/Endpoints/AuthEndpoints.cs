using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Entities;
using Pennies.Auth.Services;

namespace Pennies.Auth.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth").WithTags("Auth");

        group.MapPost("/register", Register);
        group.MapPost("/login", Login);
        group.MapPost("/verify-email", VerifyEmail);
        group.MapPost("/resend-confirmation", ResendConfirmation);
        group.MapGet("/check-email", CheckEmail);

        return app;
    }

    private static async Task<IResult> Register(
        RegisterRequest request,
        UserManager<AuthUser> userManager,
        EmailService emailService)
    {
        var existing = await userManager.FindByEmailAsync(request.Email);
        if (existing is not null)
            return Results.Conflict(new { error = "Email is already in use." });

        var user = new AuthUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName,
            CreatedAt = DateTime.UtcNow,
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var message = string.Join("; ", result.Errors.Select(e => e.Description));
            return Results.UnprocessableEntity(new { error = message });
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var link = $"/auth/verify-email?userId={user.Id}&token={Uri.EscapeDataString(token)}";
        await emailService.SendEmailConfirmationAsync(user.Email!, link);

        return Results.Created(string.Empty, new { id = user.Id, email = user.Email, displayName = user.DisplayName, emailConfirmationToken = token });
    }

    private static async Task<IResult> Login(
        LoginRequest request,
        UserManager<AuthUser> userManager,
        SignInManager<AuthUser> signInManager,
        JwtTokenService tokenService)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return Results.Unauthorized();

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
            return Results.Unauthorized();

        var token = tokenService.GenerateAccessToken(user);
        return Results.Ok(new { accessToken = token, expiresAt = DateTime.UtcNow.AddHours(1) });
    }

    private static async Task<IResult> VerifyEmail(
        VerifyEmailRequest request,
        UserManager<AuthUser> userManager)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user is null)
            return Results.NotFound(new { error = "User not found." });

        var result = await userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded)
            return Results.BadRequest(new { error = "Invalid or expired token." });

        return Results.Ok(new { message = "Email confirmed." });
    }

    private static async Task<IResult> ResendConfirmation(
        ResendConfirmationRequest request,
        UserManager<AuthUser> userManager,
        EmailService emailService)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return Results.NotFound(new { error = "User not found." });

        if (await userManager.IsEmailConfirmedAsync(user))
            return Results.BadRequest(new { error = "Email is already confirmed." });

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var link = $"/auth/verify-email?userId={user.Id}&token={Uri.EscapeDataString(token)}";
        await emailService.SendEmailConfirmationAsync(user.Email!, link);

        return Results.Ok(new { emailConfirmationToken = token });
    }

    private static async Task<IResult> CheckEmail(
        string email,
        UserManager<AuthUser> userManager)
    {
        var user = await userManager.FindByEmailAsync(email);
        return Results.Ok(new { exists = user is not null });
    }
}

public sealed record RegisterRequest(string DisplayName, string Email, string Password);
public sealed record LoginRequest(string Email, string Password);
public sealed record VerifyEmailRequest(string UserId, string Token);
public sealed record ResendConfirmationRequest(string Email);
