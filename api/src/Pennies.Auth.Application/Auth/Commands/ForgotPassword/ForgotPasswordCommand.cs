using MediatR;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.ForgotPassword;

public sealed record ForgotPasswordCommand(string Email, string ResetBaseUrl)
    : IRequest<Result<bool>>;
