using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Services;
using Pennies.Messaging;
using Pennies.Messaging.Contracts;

namespace Pennies.Auth.Application.Auth.Commands.ForgotPassword;

internal sealed class ForgotPasswordHandler(
    UserManager<AuthUser> userManager,
    IPasswordResetTokenService tokenService,
    IMessagePublisher publisher)
    : IRequestHandler<ForgotPasswordCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(ForgotPasswordCommand command, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(command.Email);
        if (user is null)
            return Result.Success(true);

        var identityToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var protectedToken = tokenService.Protect(user.Id, identityToken);
        var link = $"{command.ResetBaseUrl}?t={Uri.EscapeDataString(protectedToken)}";
        await publisher.PublishAsync(new SendPasswordResetEmailEvent(user.Email!, link), cancellationToken);

        return Result.Success(true);
    }
}
