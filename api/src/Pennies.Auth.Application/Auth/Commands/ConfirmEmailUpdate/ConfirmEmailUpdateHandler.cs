using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;

namespace Pennies.Auth.Application.Auth.Commands.ConfirmEmailUpdate;

internal sealed class ConfirmEmailUpdateHandler(UserManager<AuthUser> userManager)
    : IRequestHandler<ConfirmEmailUpdateCommand, Result<ProfileResponse>>
{
    public async Task<Result<ProfileResponse>> Handle(ConfirmEmailUpdateCommand command, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(command.UserId);
        if (user is null)
            return Result.Failure<ProfileResponse>(Error.NotFound("User not found."));

        if (user.PendingEmail is null)
            return Result.Failure<ProfileResponse>(Error.Validation("No pending email change."));

        if (user.EmailUpdateCode != command.Code || user.EmailUpdateCodeExpiresAt < DateTime.UtcNow)
            return Result.Failure<ProfileResponse>(Error.Validation("Invalid or expired code."));

        var pendingEmail = user.PendingEmail;

        var setEmailResult = await userManager.SetEmailAsync(user, pendingEmail);
        if (!setEmailResult.Succeeded)
        {
            var msg = string.Join("; ", setEmailResult.Errors.Select(e => e.Description));
            return Result.Failure<ProfileResponse>(Error.Validation(msg));
        }

        var setUserNameResult = await userManager.SetUserNameAsync(user, pendingEmail);
        if (!setUserNameResult.Succeeded)
        {
            var msg = string.Join("; ", setUserNameResult.Errors.Select(e => e.Description));
            return Result.Failure<ProfileResponse>(Error.Validation(msg));
        }

        var identityToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var confirmResult = await userManager.ConfirmEmailAsync(user, identityToken);
        if (!confirmResult.Succeeded)
        {
            var msg = string.Join("; ", confirmResult.Errors.Select(e => e.Description));
            return Result.Failure<ProfileResponse>(Error.Validation(msg));
        }

        user.PendingEmail = null;
        user.EmailUpdateCode = null;
        user.EmailUpdateCodeExpiresAt = null;
        await userManager.UpdateAsync(user);

        return Result.Success(new ProfileResponse(user.Id, user.DisplayName, user.Email!));
    }
}
