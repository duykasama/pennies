using MediatR;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.VerifyEmail;

public sealed record VerifyEmailCommand(string Token) : IRequest<Result<bool>>;
