using FluentValidation;

namespace Pennies.Application.Expenses.Commands.UpdateExpense;

public sealed class UpdateExpenseValidator : AbstractValidator<UpdateExpenseCommand>
{
    public UpdateExpenseValidator()
    {
        RuleFor(x => x.ExpenseId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Amount)
            .NotEqual(0)
            .LessThan(0).WithMessage("Expense amount must be negative.");
        RuleFor(x => x.Date)
            .NotEmpty()
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow));
        RuleFor(x => x.CategoryId).GreaterThan(0);
        RuleFor(x => x.UpdatedAt).NotEmpty();
    }
}
