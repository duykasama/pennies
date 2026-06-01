using FluentValidation;

namespace Pennies.Application.Expenses.Queries.GetExpenses;

public sealed class GetExpensesValidator : AbstractValidator<GetExpensesQuery>
{
    public GetExpensesValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Month).InclusiveBetween(1, 12).When(x => x.Month.HasValue);
        RuleFor(x => x.Year).GreaterThan(0).When(x => x.Year.HasValue);
        RuleFor(x => x.Month).NotNull().When(x => x.Year.HasValue)
            .WithMessage("Month is required when Year is provided.");
        RuleFor(x => x.Year).NotNull().When(x => x.Month.HasValue)
            .WithMessage("Year is required when Month is provided.");
        RuleFor(x => x.PageIndex).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
