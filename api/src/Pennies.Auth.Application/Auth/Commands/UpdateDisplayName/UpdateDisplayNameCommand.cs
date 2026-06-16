using MediatR;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.UpdateDisplayName;

public sealed record UpdateDisplayNameCommand(string UserId, string DisplayName)
    : IRequest<Result<ProfileResponse>>;
