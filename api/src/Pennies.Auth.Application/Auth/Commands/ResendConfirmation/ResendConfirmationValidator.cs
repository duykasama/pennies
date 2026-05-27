using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.ResendConfirmation;

public sealed class ResendConfirmationValidator : AbstractValidator<ResendConfirmationCommand>
{
    public ResendConfirmationValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.ConfirmationBaseUrl).NotEmpty();
    }
}
