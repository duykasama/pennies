using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.Logout;

public sealed class LogoutValidator : AbstractValidator<LogoutCommand>
{
    public LogoutValidator()
    {
        RuleFor(x => x.Jti).NotEmpty();
        RuleFor(x => x.RefreshToken).NotEmpty();
    }
}
