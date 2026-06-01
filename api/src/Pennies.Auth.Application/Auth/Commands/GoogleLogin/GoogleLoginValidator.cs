using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.GoogleLogin;

public sealed class GoogleLoginValidator : AbstractValidator<GoogleLoginCommand>
{
    public GoogleLoginValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.RedirectUri)
            .NotEmpty()
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("redirectUri must be a valid absolute URI.");
    }
}
