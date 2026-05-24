using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Queries.GetExpenses;

internal sealed class GetExpensesHandler(IExpenseRepository repository)
    : IRequestHandler<GetExpensesQuery, Result<IReadOnlyList<ExpenseResponse>>>
{
    public async Task<Result<IReadOnlyList<ExpenseResponse>>> Handle(
        GetExpensesQuery request,
        CancellationToken cancellationToken)
    {
        var expenses = await repository.ListByUserAsync(request.UserId, cancellationToken);
        return Result.Success(expenses.Select(e => e.ToResponse()).ToList().AsReadOnly() as IReadOnlyList<ExpenseResponse>);
    }
}
