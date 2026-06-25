using MediatR;
using Microsoft.EntityFrameworkCore;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Persistence;
using Pennies.Auth.Application.Services;

namespace Pennies.Auth.Application.Auth.Commands.Logout;

internal sealed class LogoutHandler(AuthDbContext dbContext, TokenBlacklistService blacklist)
    : IRequestHandler<LogoutCommand, Result<bool>>
{
    private static readonly TimeSpan AccessTokenMaxLifetime = TimeSpan.FromHours(1);

    public async Task<Result<bool>> Handle(LogoutCommand command, CancellationToken ct)
    {
        await blacklist.BlacklistAsync(command.Jti, AccessTokenMaxLifetime, ct);

        var token = await dbContext.RefreshTokens
            .SingleOrDefaultAsync(r => r.Token == command.RefreshToken && !r.IsRevoked, ct);
        if (token is not null)
        {
            token.IsRevoked = true;
            await dbContext.SaveChangesAsync(ct);
        }

        return Result.Success(true);
    }
}
