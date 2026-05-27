using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;

namespace Pennies.Auth.Application.Auth.Queries.CheckEmail;

internal sealed class CheckEmailHandler(UserManager<AuthUser> userManager)
    : IRequestHandler<CheckEmailQuery, Result<CheckEmailResponse>>
{
    public async Task<Result<CheckEmailResponse>> Handle(CheckEmailQuery query, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(query.Email);
        return Result.Success(new CheckEmailResponse(user is not null));
    }
}
