using MediatR;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.ConfirmEmailUpdate;

public sealed record ConfirmEmailUpdateCommand(string UserId, string Code)
    : IRequest<Result<ProfileResponse>>;
