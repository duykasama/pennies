using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Commands.UpdateExpense;

internal sealed class UpdateExpenseHandler(IExpenseRepository repository)
    : IRequestHandler<UpdateExpenseCommand, Result<ExpenseResponse>>
{
    public async Task<Result<ExpenseResponse>> Handle(UpdateExpenseCommand command, CancellationToken cancellationToken)
    {
        var expense = await repository.GetByIdAsync(command.ExpenseId, cancellationToken);
        if (expense is null)
            return Result.Failure<ExpenseResponse>(Error.NotFound("Expense not found."));

        if (expense.UserId != command.UserId)
            return Result.Failure<ExpenseResponse>(Error.Unauthorized("You do not have permission to update this expense."));

        if (expense.UpdatedAt != command.UpdatedAt)
            return Result.Failure<ExpenseResponse>(Error.Conflict("The expense has been modified by another request."));

        expense.Title = command.Title;
        expense.Description = command.Description;
        expense.Amount = command.Amount;
        expense.Category = command.Category;
        expense.Date = command.Date;
        expense.UpdatedAt = DateTime.UtcNow;

        await repository.UpdateAsync(expense, cancellationToken);
        return Result.Success(expense.ToResponse());
    }
}
