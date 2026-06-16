using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.ConfirmEmailUpdate;

public sealed class ConfirmEmailUpdateValidator : AbstractValidator<ConfirmEmailUpdateCommand>
{
    public ConfirmEmailUpdateValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Code).NotEmpty();
    }
}
