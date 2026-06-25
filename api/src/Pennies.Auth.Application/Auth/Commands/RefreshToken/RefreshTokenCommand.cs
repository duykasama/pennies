using MediatR;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Commands.RefreshToken;

public sealed record RefreshTokenCommand(string Token, string? AccessToken = null) : IRequest<Result<LoginResponse>>;
