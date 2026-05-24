using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Commands.CreateExpense;

internal sealed class CreateExpenseHandler(IExpenseRepository repository)
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
            Date = request.Date,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await repository.AddAsync(expense, cancellationToken);
        return Result.Success(expense.ToResponse());
    }
}
