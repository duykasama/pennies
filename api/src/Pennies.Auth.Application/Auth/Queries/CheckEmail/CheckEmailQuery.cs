using MediatR;
using Pennies.Auth.Application.Auth.DTOs;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Queries.CheckEmail;

public sealed record CheckEmailQuery(string Email) : IRequest<Result<CheckEmailResponse>>;
