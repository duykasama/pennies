using MediatR;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.ChangePassword;

public sealed record ChangePasswordCommand(string UserId, string CurrentPassword, string NewPassword)
    : IRequest<Result<bool>>;
