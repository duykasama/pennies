using System.Security.Claims;
using MediatR;
using Pennies.Auth.Api.Extensions;
using Pennies.Auth.Application.Auth.Commands.ChangePassword;
using Pennies.Auth.Application.Auth.Commands.ConfirmEmailUpdate;
using Pennies.Auth.Application.Auth.Commands.ForgotPassword;
using Pennies.Auth.Application.Auth.Commands.GoogleLogin;
using Pennies.Auth.Application.Auth.Commands.Login;
using Pennies.Auth.Application.Auth.Commands.Logout;
using Pennies.Auth.Application.Auth.Commands.RefreshToken;
using Pennies.Auth.Application.Auth.Commands.Register;
using Pennies.Auth.Application.Auth.Commands.RequestEmailUpdate;
using Pennies.Auth.Application.Auth.Commands.ResendConfirmation;
using Pennies.Auth.Application.Auth.Commands.ResetPassword;
using Pennies.Auth.Application.Auth.Commands.UpdateDisplayName;
using Pennies.Auth.Application.Auth.Commands.VerifyEmail;
using Pennies.Auth.Application.Auth.Queries.CheckEmail;
using Pennies.Auth.Application.Auth.Queries.GetGoogleOAuthUrl;
using Pennies.Auth.Application.Auth.Queries.GetProfile;

namespace Pennies.Auth.Api.Endpoints;

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
        group.MapGet("/google/url", GetGoogleOAuthUrl);
        group.MapPost("/google/login", GoogleLogin);
        group.MapPost("/forgot-password", ForgotPassword);
        group.MapPost("/reset-password", ResetPassword);
        group.MapPost("/refresh-token", RefreshToken);

        var protectedGroup = app.MapGroup("/auth").WithTags("Auth").RequireAuthorization();
        protectedGroup.MapGet("/profile", GetProfile);
        protectedGroup.MapPut("/profile/display-name", UpdateDisplayName);
        protectedGroup.MapPost("/change-password", ChangePassword);
        protectedGroup.MapPost("/request-email-update", RequestEmailUpdate);
        protectedGroup.MapPost("/confirm-email-update", ConfirmEmailUpdate);
        protectedGroup.MapPost("/logout", Logout);

        return app;
    }

    private static async Task<IResult> Register(RegisterRequest request, ISender mediator)
    {
        var command = new RegisterCommand(request.DisplayName, request.Email, request.Password, request.ConfirmationBaseUrl);
        return (await mediator.Send(command)).ToHttpResult(201);
    }

    private static async Task<IResult> Login(LoginRequest request, ISender mediator)
    {
        var command = new LoginCommand(request.Email, request.Password);
        return (await mediator.Send(command)).ToHttpResult();
    }

    private static async Task<IResult> VerifyEmail(VerifyEmailRequest request, ISender mediator)
    {
        var command = new VerifyEmailCommand(request.Token);
        return (await mediator.Send(command)).ToHttpResult();
    }

    private static async Task<IResult> ResendConfirmation(ResendConfirmationRequest request, ISender mediator)
    {
        var command = new ResendConfirmationCommand(request.Email, request.ConfirmationBaseUrl);
        return (await mediator.Send(command)).ToHttpResult();
    }

    private static async Task<IResult> CheckEmail(string email, ISender mediator)
    {
        return (await mediator.Send(new CheckEmailQuery(email))).ToHttpResult();
    }

    private static async Task<IResult> GetGoogleOAuthUrl(string redirectUri, ISender mediator)
    {
        return (await mediator.Send(new GetGoogleOAuthUrlQuery(redirectUri))).ToHttpResult();
    }

    private static async Task<IResult> GoogleLogin(GoogleLoginRequest request, ISender mediator)
    {
        return (await mediator.Send(new GoogleLoginCommand(request.Code, request.RedirectUri))).ToHttpResult();
    }

    private static async Task<IResult> ForgotPassword(ForgotPasswordRequest request, ISender mediator)
    {
        return (await mediator.Send(new ForgotPasswordCommand(request.Email, request.ResetBaseUrl))).ToHttpResult();
    }

    private static async Task<IResult> ResetPassword(ResetPasswordRequest request, ISender mediator)
    {
        return (await mediator.Send(new ResetPasswordCommand(request.Token, request.NewPassword))).ToHttpResult();
    }

    private static async Task<IResult> RefreshToken(RefreshTokenRequest request, ISender mediator)
    {
        return (await mediator.Send(new RefreshTokenCommand(request.Token, request.AccessToken))).ToHttpResult();
    }

    private static async Task<IResult> Logout(LogoutRequest request, ClaimsPrincipal user, ISender mediator)
    {
        var jti = user.FindFirstValue("jti")!;
        return (await mediator.Send(new LogoutCommand(jti, request.RefreshToken))).ToHttpResult();
    }

    private static async Task<IResult> GetProfile(ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return (await mediator.Send(new GetProfileQuery(userId))).ToHttpResult();
    }

    private static async Task<IResult> UpdateDisplayName(UpdateDisplayNameRequest request, ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return (await mediator.Send(new UpdateDisplayNameCommand(userId, request.DisplayName))).ToHttpResult();
    }

    private static async Task<IResult> ChangePassword(ChangePasswordRequest request, ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return (await mediator.Send(new ChangePasswordCommand(userId, request.CurrentPassword, request.NewPassword))).ToHttpResult();
    }

    private static async Task<IResult> RequestEmailUpdate(RequestEmailUpdateRequest request, ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return (await mediator.Send(new RequestEmailUpdateCommand(userId, request.NewEmail))).ToHttpResult();
    }

    private static async Task<IResult> ConfirmEmailUpdate(ConfirmEmailUpdateRequest request, ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return (await mediator.Send(new ConfirmEmailUpdateCommand(userId, request.Code))).ToHttpResult();
    }
}

public sealed record RegisterRequest
{
    public required string DisplayName { get; init; }
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string ConfirmationBaseUrl { get; init; }
}

public sealed record LoginRequest(string Email, string Password);
public sealed record GoogleLoginRequest(string Code, string RedirectUri);
public sealed record VerifyEmailRequest(string Token);

public sealed record ResendConfirmationRequest
{
    public required string Email { get; init; }
    public required string ConfirmationBaseUrl { get; init; }
}

public sealed record ForgotPasswordRequest(string Email, string ResetBaseUrl);
public sealed record ResetPasswordRequest(string Token, string NewPassword);
public sealed record UpdateDisplayNameRequest(string DisplayName);
public sealed record ChangePasswordRequest(string CurrentPassword, string NewPassword);
public sealed record RequestEmailUpdateRequest(string NewEmail);
public sealed record ConfirmEmailUpdateRequest(string Code);
public sealed record RefreshTokenRequest(string Token, string? AccessToken = null);
public sealed record LogoutRequest(string RefreshToken);
