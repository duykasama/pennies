using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;

namespace Pennies.Auth.Application.Auth.Commands.ChangePassword;

internal sealed class ChangePasswordHandler(UserManager<AuthUser> userManager)
    : IRequestHandler<ChangePasswordCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(ChangePasswordCommand command, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(command.UserId);
        if (user is null)
            return Result.Failure<bool>(Error.NotFound("User not found."));

        var result = await userManager.ChangePasswordAsync(user, command.CurrentPassword, command.NewPassword);
        if (!result.Succeeded)
        {
            var message = string.Join("; ", result.Errors.Select(e => e.Description));
            return Result.Failure<bool>(Error.Validation(message));
        }

        return Result.Success(true);
    }
}
