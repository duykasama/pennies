using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Services;

namespace Pennies.Auth.Application.Auth.Commands.GoogleLogin;

internal sealed class GoogleLoginHandler(
    IGoogleOAuthService googleOAuthService,
    UserManager<AuthUser> userManager,
    JwtTokenService tokenService)
    : IRequestHandler<GoogleLoginCommand, Result<LoginResponse>>
{
    private const string LoginProvider = "Google";

    public async Task<Result<LoginResponse>> Handle(GoogleLoginCommand command, CancellationToken cancellationToken)
    {
        GoogleUserInfo googleUser;
        try
        {
            googleUser = await googleOAuthService.ExchangeCodeAsync(command.Code, command.RedirectUri, cancellationToken);
        }
        catch (Exception)
        {
            return Result.Failure<LoginResponse>(Error.Unauthorized("Google authentication failed."));
        }

        var user = await userManager.FindByLoginAsync(LoginProvider, googleUser.GoogleUserId);

        if (user is null)
        {
            user = await userManager.FindByEmailAsync(googleUser.Email);

            if (user is not null)
            {
                var linkResult = await userManager.AddLoginAsync(
                    user,
                    new UserLoginInfo(LoginProvider, googleUser.GoogleUserId, "Google"));

                if (!linkResult.Succeeded)
                {
                    var msg = string.Join("; ", linkResult.Errors.Select(e => e.Description));
                    return Result.Failure<LoginResponse>(Error.Validation(msg));
                }
            }
        }

        if (user is null)
        {
            user = new AuthUser
            {
                UserName = googleUser.Email,
                Email = googleUser.Email,
                DisplayName = string.IsNullOrWhiteSpace(googleUser.Name) ? googleUser.Email : googleUser.Name,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
            };

            var createResult = await userManager.CreateAsync(user);
            if (!createResult.Succeeded)
            {
                var msg = string.Join("; ", createResult.Errors.Select(e => e.Description));
                return Result.Failure<LoginResponse>(Error.Validation(msg));
            }

            var addLoginResult = await userManager.AddLoginAsync(
                user,
                new UserLoginInfo(LoginProvider, googleUser.GoogleUserId, "Google"));

            if (!addLoginResult.Succeeded)
            {
                var msg = string.Join("; ", addLoginResult.Errors.Select(e => e.Description));
                return Result.Failure<LoginResponse>(Error.Validation(msg));
            }
        }

        var token = tokenService.GenerateAccessToken(user);
        return Result.Success(new LoginResponse(token, DateTime.UtcNow.AddHours(1)));
    }
}
