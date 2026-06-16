using MediatR;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Queries.GetProfile;

public sealed record GetProfileQuery(string UserId) : IRequest<Result<ProfileResponse>>;
