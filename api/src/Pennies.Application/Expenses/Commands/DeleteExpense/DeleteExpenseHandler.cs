using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Common.Caching;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Commands.DeleteExpense;

internal sealed class DeleteExpenseHandler(IExpenseRepository repository, ICacheInvalidator cacheInvalidator)
    : IRequestHandler<DeleteExpenseCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(
        DeleteExpenseCommand request,
        CancellationToken cancellationToken)
    {
        var expense = await repository.GetByIdAsync(request.ExpenseId, cancellationToken);

        if (expense is null)
            return Result.Failure<bool>(Error.NotFound("Expense not found."));

        if (expense.UserId != request.UserId)
            return Result.Failure<bool>(Error.Unauthorized("You do not own this expense."));

        await repository.DeleteAsync(expense, cancellationToken);
        await cacheInvalidator.InvalidateAsync($"expenses:{request.UserId}:list:*", cancellationToken);
        await cacheInvalidator.InvalidateAsync($"expenses:{request.UserId}:item:{request.ExpenseId}", cancellationToken);
        return Result.Success(true);
    }
}
