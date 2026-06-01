using FluentValidation;

namespace Pennies.Auth.Application.Auth.Queries.GetGoogleOAuthUrl;

public sealed class GetGoogleOAuthUrlValidator : AbstractValidator<GetGoogleOAuthUrlQuery>
{
    public GetGoogleOAuthUrlValidator()
    {
        RuleFor(x => x.RedirectUri)
            .NotEmpty()
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("redirectUri must be a valid absolute URI.");
    }
}
