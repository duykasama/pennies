using MediatR;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.Register;

public sealed record RegisterCommand(
    string DisplayName,
    string Email,
    string Password,
    string ConfirmationBaseUrl) : IRequest<Result<RegisterResponse>>;
