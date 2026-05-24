using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Queries.GetExpenseById;

internal sealed class GetExpenseByIdHandler(IExpenseRepository repository)
    : IRequestHandler<GetExpenseByIdQuery, Result<ExpenseResponse>>
{
    public async Task<Result<ExpenseResponse>> Handle(
        GetExpenseByIdQuery request,
        CancellationToken cancellationToken)
    {
        var expense = await repository.GetByIdAsync(request.ExpenseId, cancellationToken);

        if (expense is null)
            return Result.Failure<ExpenseResponse>(Error.NotFound("Expense not found."));

        if (expense.UserId != request.UserId)
            return Result.Failure<ExpenseResponse>(Error.NotFound("Expense not found."));

        return Result.Success(expense.ToResponse());
    }
}
