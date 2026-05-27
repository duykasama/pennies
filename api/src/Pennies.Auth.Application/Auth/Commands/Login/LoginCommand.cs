using MediatR;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.Login;

public sealed record LoginCommand(string Email, string Password) : IRequest<Result<LoginResponse>>;
