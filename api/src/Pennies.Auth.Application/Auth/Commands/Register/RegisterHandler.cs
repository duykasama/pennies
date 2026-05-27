using MediatR;
using Microsoft.AspNetCore.Identity;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Services;
using Pennies.Messaging;
using Pennies.Messaging.Contracts;

namespace Pennies.Auth.Application.Auth.Commands.Register;

internal sealed class RegisterHandler(
    UserManager<AuthUser> userManager,
    IEmailConfirmationTokenService tokenService,
    IMessagePublisher publisher)
    : IRequestHandler<RegisterCommand, Result<RegisterResponse>>
{
    public async Task<Result<RegisterResponse>> Handle(RegisterCommand command, CancellationToken cancellationToken)
    {
        var existing = await userManager.FindByEmailAsync(command.Email);
        if (existing is not null)
            return Result.Failure<RegisterResponse>(Error.Conflict("Email is already in use."));

        var user = new AuthUser
        {
            UserName = command.Email,
            Email = command.Email,
            DisplayName = command.DisplayName,
            CreatedAt = DateTime.UtcNow,
        };

        var result = await userManager.CreateAsync(user, command.Password);
        if (!result.Succeeded)
        {
            var message = string.Join("; ", result.Errors.Select(e => e.Description));
            return Result.Failure<RegisterResponse>(Error.Validation(message));
        }

        var identityToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var confirmationToken = tokenService.Protect(user.Id, identityToken);
        var link = $"{command.ConfirmationBaseUrl}?t={Uri.EscapeDataString(confirmationToken)}";
        await publisher.PublishAsync(new SendConfirmationEmailEvent(user.Email!, link));

        return Result.Success(new RegisterResponse(user.Id, user.Email!, user.DisplayName));
    }
}
