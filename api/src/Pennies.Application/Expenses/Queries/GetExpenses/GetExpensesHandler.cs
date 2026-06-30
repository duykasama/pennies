using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Queries.GetExpenses;

internal sealed class GetExpensesHandler(IExpenseRepository repository)
    : IRequestHandler<GetExpensesQuery, Result<PagedResponse<ExpenseResponse>>>
{
    public async Task<Result<PagedResponse<ExpenseResponse>>> Handle(
        GetExpensesQuery request,
        CancellationToken cancellationToken)
    {
        var (items, totalCount) = await repository.ListByUserAsync(
            request.UserId, request.Month, request.Year,
            request.PageIndex, request.PageSize, cancellationToken);

        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);
        var response = new PagedResponse<ExpenseResponse>(
            items.Select(e => e.ToResponse()).ToList().AsReadOnly(),
            request.PageIndex, request.PageSize, totalCount, totalPages);

        return Result.Success(response);
    }
}
