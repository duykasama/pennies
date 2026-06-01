using MediatR;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.GoogleLogin;

public sealed record GoogleLoginCommand(string Code, string RedirectUri) : IRequest<Result<LoginResponse>>;
