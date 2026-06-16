using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;

namespace Pennies.Auth.Application.Auth.Queries.GetProfile;

internal sealed class GetProfileHandler(UserManager<AuthUser> userManager)
    : IRequestHandler<GetProfileQuery, Result<ProfileResponse>>
{
    public async Task<Result<ProfileResponse>> Handle(GetProfileQuery query, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(query.UserId);
        if (user is null)
            return Result.Failure<ProfileResponse>(Error.NotFound("User not found."));

        return Result.Success(new ProfileResponse(user.Id, user.DisplayName, user.Email!));
    }
}
