using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;

namespace Pennies.Auth.Application.Auth.Commands.UpdateDisplayName;

internal sealed class UpdateDisplayNameHandler(UserManager<AuthUser> userManager)
    : IRequestHandler<UpdateDisplayNameCommand, Result<ProfileResponse>>
{
    public async Task<Result<ProfileResponse>> Handle(UpdateDisplayNameCommand command, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(command.UserId);
        if (user is null)
            return Result.Failure<ProfileResponse>(Error.NotFound("User not found."));

        user.DisplayName = command.DisplayName;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var msg = string.Join("; ", result.Errors.Select(e => e.Description));
            return Result.Failure<ProfileResponse>(Error.Validation(msg));
        }

        return Result.Success(new ProfileResponse(user.Id, user.DisplayName, user.Email!));
    }
}
