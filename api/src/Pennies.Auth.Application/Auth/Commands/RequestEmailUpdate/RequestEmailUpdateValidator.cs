using FluentValidation;

namespace Pennies.Auth.Application.Auth.Commands.RequestEmailUpdate;

public sealed class RequestEmailUpdateValidator : AbstractValidator<RequestEmailUpdateCommand>
{
    public RequestEmailUpdateValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.NewEmail).NotEmpty().EmailAddress();
    }
}
