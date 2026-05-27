using MediatR;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.ResendConfirmation;

public sealed record ResendConfirmationCommand(string Email, string ConfirmationBaseUrl) : IRequest<Result<bool>>;
