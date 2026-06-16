using System.Security.Cryptography;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Services;

namespace Pennies.Auth.Application.Auth.Commands.ResetPassword;

internal sealed class ResetPasswordHandler(
    UserManager<AuthUser> userManager,
    IPasswordResetTokenService tokenService)
    : IRequestHandler<ResetPasswordCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(ResetPasswordCommand command, CancellationToken cancellationToken)
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
            return Result.Failure<bool>(Error.Validation("Invalid or expired token."));

        var result = await userManager.ResetPasswordAsync(user, identityToken, command.NewPassword);
        if (!result.Succeeded)
        {
            var message = string.Join("; ", result.Errors.Select(e => e.Description));
            return Result.Failure<bool>(Error.Validation(message));
        }

        return Result.Success(true);
    }
}
