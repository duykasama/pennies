using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Entities;
using Pennies.Messaging;
using Pennies.Messaging.Contracts;

namespace Pennies.Auth.Application.Auth.Commands.RequestEmailUpdate;

internal sealed class RequestEmailUpdateHandler(
    UserManager<AuthUser> userManager,
    IMessagePublisher publisher,
    IOptions<EmailUpdateSettings> settings)
    : IRequestHandler<RequestEmailUpdateCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(RequestEmailUpdateCommand command, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(command.UserId);
        if (user is null)
            return Result.Failure<bool>(Error.NotFound("User not found."));

        var existing = await userManager.FindByEmailAsync(command.NewEmail);
        if (existing is not null && existing.Id != user.Id)
            return Result.Failure<bool>(Error.Conflict("Email is already in use."));

        var code = Random.Shared.Next(100000, 1000000).ToString();
        var expiryMinutes = settings.Value.CodeExpiryMinutes;

        user.PendingEmail = command.NewEmail;
        user.EmailUpdateCode = code;
        user.EmailUpdateCodeExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var msg = string.Join("; ", result.Errors.Select(e => e.Description));
            return Result.Failure<bool>(Error.Validation(msg));
        }

        await publisher.PublishAsync(new SendEmailUpdateCodeEvent(command.NewEmail, code, expiryMinutes), cancellationToken);

        return Result.Success(true);
    }
}
