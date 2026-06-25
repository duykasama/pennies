using MediatR;
using Microsoft.EntityFrameworkCore;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Persistence;
using Pennies.Auth.Application.Services;
using RefreshTokenEntity = Pennies.Auth.Application.Entities.RefreshToken;

namespace Pennies.Auth.Application.Auth.Commands.RefreshToken;

internal sealed class RefreshTokenHandler(
    AuthDbContext dbContext,
    JwtTokenService tokenService,
    TokenBlacklistService blacklist)
    : IRequestHandler<RefreshTokenCommand, Result<LoginResponse>>
{
    public async Task<Result<LoginResponse>> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
    {
        var stored = await dbContext.RefreshTokens
            .Include(r => r.User)
            .SingleOrDefaultAsync(r => r.Token == command.Token, cancellationToken);

        if (stored is null || stored.IsRevoked || stored.ExpiresAt <= DateTime.UtcNow)
            return Result.Failure<LoginResponse>(Error.Unauthorized("Invalid or expired refresh token."));

        stored.IsRevoked = true;

        var newRefreshToken = tokenService.GenerateRefreshToken();
        var newRefreshTokenExpiresAt = DateTime.UtcNow.AddDays(30);

        dbContext.RefreshTokens.Add(new RefreshTokenEntity
        {
            Token = newRefreshToken,
            UserId = stored.UserId,
            ExpiresAt = newRefreshTokenExpiresAt,
            CreatedAt = DateTime.UtcNow,
        });

        await dbContext.SaveChangesAsync(cancellationToken);

        if (command.AccessToken is not null)
        {
            var jti = tokenService.TryExtractJti(command.AccessToken);
            var exp = tokenService.TryExtractExpiry(command.AccessToken);
            if (jti is not null && exp is not null)
            {
                var ttl = exp.Value - DateTime.UtcNow;
                if (ttl > TimeSpan.Zero)
                    await blacklist.BlacklistAsync(jti, ttl, cancellationToken);
            }
        }

        var accessToken = tokenService.GenerateAccessToken(stored.User);
        return Result.Success(new LoginResponse(accessToken, DateTime.UtcNow.AddHours(1), newRefreshToken, newRefreshTokenExpiresAt));
    }
}
