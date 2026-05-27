using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.VerifyEmail;

public sealed class VerifyEmailValidator : AbstractValidator<VerifyEmailCommand>
{
    public VerifyEmailValidator()
    {
        RuleFor(x => x.Token).NotEmpty();
    }
}
