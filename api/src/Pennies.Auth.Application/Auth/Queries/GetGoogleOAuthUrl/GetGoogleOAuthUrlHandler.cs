using MediatR;
using Pennies.Auth.Application.Common;
using Pennies.Auth.Application.Services;

namespace Pennies.Auth.Application.Auth.Queries.GetGoogleOAuthUrl;

internal sealed class GetGoogleOAuthUrlHandler(IGoogleOAuthService googleOAuthService)
    : IRequestHandler<GetGoogleOAuthUrlQuery, Result<string>>
{
    public Task<Result<string>> Handle(GetGoogleOAuthUrlQuery query, CancellationToken cancellationToken)
    {
        var state = Guid.NewGuid().ToString("N");
        var url = googleOAuthService.BuildAuthorizationUrl(query.RedirectUri, state);
        return Task.FromResult(Result.Success(url));
    }
}
