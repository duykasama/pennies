using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.RefreshToken;

public sealed class RefreshTokenValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenValidator()
    {
        RuleFor(x => x.Token).NotEmpty();
    }
}
