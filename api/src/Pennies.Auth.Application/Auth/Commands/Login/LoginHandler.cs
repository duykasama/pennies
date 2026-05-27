using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Services;

namespace Pennies.Auth.Application.Auth.Commands.Login;

internal sealed class LoginHandler(
    UserManager<AuthUser> userManager,
    SignInManager<AuthUser> signInManager,
    JwtTokenService tokenService)
    : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    public async Task<Result<LoginResponse>> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(command.Email);
        if (user is null)
            return Result.Failure<LoginResponse>(Error.Unauthorized("Invalid credentials."));

        var result = await signInManager.CheckPasswordSignInAsync(user, command.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
            return Result.Failure<LoginResponse>(Error.Unauthorized("Invalid credentials."));

        var token = tokenService.GenerateAccessToken(user);
        return Result.Success(new LoginResponse(token, DateTime.UtcNow.AddHours(1)));
    }
}
