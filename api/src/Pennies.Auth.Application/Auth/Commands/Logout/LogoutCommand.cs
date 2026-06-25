using MediatR;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.Logout;

public sealed record LogoutCommand(string Jti, string RefreshToken) : IRequest<Result<bool>>;
