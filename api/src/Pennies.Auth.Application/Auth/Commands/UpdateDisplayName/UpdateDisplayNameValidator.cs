using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.UpdateDisplayName;

public sealed class UpdateDisplayNameValidator : AbstractValidator<UpdateDisplayNameCommand>
{
    public UpdateDisplayNameValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.DisplayName).NotEmpty();
    }
}
