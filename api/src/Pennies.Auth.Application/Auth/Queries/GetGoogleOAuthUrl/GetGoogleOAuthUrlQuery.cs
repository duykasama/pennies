using MediatR;
using Pennies.Auth.Application.Common;

namespace Pennies.Auth.Application.Auth.Queries.GetGoogleOAuthUrl;

public sealed record GetGoogleOAuthUrlQuery(string RedirectUri) : IRequest<Result<string>>;
