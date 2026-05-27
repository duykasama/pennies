using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Services;
using Pennies.Messaging;
using Pennies.Messaging.Contracts;

namespace Pennies.Auth.Application.Auth.Commands.ResendConfirmation;

internal sealed class ResendConfirmationHandler(
    UserManager<AuthUser> userManager,
    IEmailConfirmationTokenService tokenService,
    IMessagePublisher publisher)
    : IRequestHandler<ResendConfirmationCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(ResendConfirmationCommand command, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(command.Email);
        if (user is null)
            return Result.Failure<bool>(Error.NotFound("User not found."));

        if (await userManager.IsEmailConfirmedAsync(user))
            return Result.Failure<bool>(Error.Validation("Email is already confirmed."));

        var identityToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var confirmationToken = tokenService.Protect(user.Id, identityToken);
        var link = $"{command.ConfirmationBaseUrl}?token={Uri.EscapeDataString(confirmationToken)}";
        await publisher.PublishAsync(new SendConfirmationEmailEvent(user.Email!, link));

        return Result.Success(true);
    }
}
