using MediatR;
using Pennies.Auth.Api.Extensions;
using Pennies.Auth.Application.Auth.Commands.Login;
using Pennies.Auth.Application.Auth.Commands.Register;
using Pennies.Auth.Application.Auth.Commands.ResendConfirmation;
using Pennies.Auth.Application.Auth.Commands.VerifyEmail;
using Pennies.Auth.Application.Auth.Queries.CheckEmail;

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
}

public sealed record RegisterRequest
{
    public required string DisplayName { get; init; }
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string ConfirmationBaseUrl { get; init; }
}

public sealed record LoginRequest(string Email, string Password);
public sealed record VerifyEmailRequest(string Token);

public sealed record ResendConfirmationRequest
{
    public required string Email { get; init; }
    public required string ConfirmationBaseUrl { get; init; }
}
