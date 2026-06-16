using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.ForgotPassword;

public sealed class ForgotPasswordValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.ResetBaseUrl).NotEmpty();
    }
}
