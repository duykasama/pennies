using System.Security.Cryptography;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Services;

namespace Pennies.Auth.Application.Auth.Commands.VerifyEmail;

internal sealed class VerifyEmailHandler(
    UserManager<AuthUser> userManager,
    IEmailConfirmationTokenService tokenService)
    : IRequestHandler<VerifyEmailCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(VerifyEmailCommand command, CancellationToken cancellationToken)
    {
        string userId, identityToken;
        try
        {
            (userId, identityToken) = tokenService.Unprotect(command.Token);
        }
        catch (CryptographicException)
        {
            return Result.Failure<bool>(Error.Validation("Invalid or expired token."));
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Result.Failure<bool>(Error.NotFound("User not found."));

        var result = await userManager.ConfirmEmailAsync(user, identityToken);
        if (!result.Succeeded)
            return Result.Failure<bool>(Error.Validation("Invalid or expired token."));

        return Result.Success(true);
    }
}
