using MediatR;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.ResetPassword;

public sealed record ResetPasswordCommand(string Token, string NewPassword)
    : IRequest<Result<bool>>;
