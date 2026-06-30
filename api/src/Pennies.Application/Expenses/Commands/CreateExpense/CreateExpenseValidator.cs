using FluentValidation;

namespace Pennies.Application.Expenses.Commands.CreateExpense;

public sealed class CreateExpenseValidator : AbstractValidator<CreateExpenseCommand>
{
    public CreateExpenseValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Amount)
            .NotEqual(0)
            .LessThan(0).WithMessage("Expense amount must be negative.");

        RuleFor(x => x.Date)
            .NotEmpty()
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Date cannot be in the future.");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0);

        RuleFor(x => x.UserId)
            .NotEmpty();
    }
}
