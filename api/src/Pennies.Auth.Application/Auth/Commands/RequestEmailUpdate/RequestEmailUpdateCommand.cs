using MediatR;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.RequestEmailUpdate;

public sealed record RequestEmailUpdateCommand(string UserId, string NewEmail)
    : IRequest<Result<bool>>;
