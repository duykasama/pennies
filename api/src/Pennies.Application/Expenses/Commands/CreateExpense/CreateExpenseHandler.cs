using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Common.Caching;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Commands.CreateExpense;

internal sealed class CreateExpenseHandler(
    IExpenseRepository repository,
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
            CategoryId = request.CategoryId,
            FrequencyId = request.FrequencyId,
            Date = request.Date,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await repository.AddAsync(expense, cancellationToken);
        await cacheInvalidator.InvalidateAsync($"expenses:{request.UserId}:list:*", cancellationToken);

        var saved = await repository.GetByIdAsync(expense.Id, cancellationToken);
        return Result.Success(saved!.ToResponse());
    }
}
