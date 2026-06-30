using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Common.Caching;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Commands.CreateExpense;

internal sealed class CreateExpenseHandler(
    IExpenseRepository repository,
    IExpenseLookupRepository lookupRepository,
    ICacheInvalidator cacheInvalidator)
    : IRequestHandler<CreateExpenseCommand, Result<ExpenseResponse>>
{
    public async Task<Result<ExpenseResponse>> Handle(
        CreateExpenseCommand request,
        CancellationToken cancellationToken)
    {
        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Title = request.Title,
            Description = request.Description,
            Amount = request.Amount,
            Category = request.Category,
            Frequency = request.Frequency,
            Date = request.Date,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await repository.AddAsync(expense, cancellationToken);
        await cacheInvalidator.InvalidateAsync($"expenses:{request.UserId}:list:*", cancellationToken);

        var categories = (await lookupRepository.GetCategoriesAsync(null, cancellationToken))
            .ToDictionary(c => c.Id);
        var frequencies = (await lookupRepository.GetFrequenciesAsync(null, cancellationToken))
            .ToDictionary(f => f.Id);

        return Result.Success(expense.ToResponse(categories, frequencies));
    }
}
