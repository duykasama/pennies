using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Queries.GetExpenseById;

internal sealed class GetExpenseByIdHandler(IExpenseRepository repository, IExpenseLookupRepository lookupRepository)
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

        var categories = (await lookupRepository.GetCategoriesAsync(null, cancellationToken))
            .ToDictionary(c => c.Id);
        var frequencies = (await lookupRepository.GetFrequenciesAsync(null, cancellationToken))
            .ToDictionary(f => f.Id);

        return Result.Success(expense.ToResponse(categories, frequencies));
    }
}
