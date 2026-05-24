using FluentValidation;

namespace Pennies.Application.Expenses.Commands.DeleteExpense;

public sealed class DeleteExpenseValidator : AbstractValidator<DeleteExpenseCommand>
{
    public DeleteExpenseValidator()
    {
        RuleFor(x => x.ExpenseId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
