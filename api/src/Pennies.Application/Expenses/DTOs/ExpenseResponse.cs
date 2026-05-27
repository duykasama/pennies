using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.DTOs;

public sealed record ExpenseResponse(
    Guid Id,
    string Title,
    string? Description,
    decimal Amount,
    int Category,
    DateOnly Date,
    DateTime CreatedAt);

internal static class ExpenseMappings
{
    internal static ExpenseResponse ToResponse(this Expense expense) =>
        new(expense.Id,
            expense.Title,
            expense.Description,
            expense.Amount,
            (int)expense.Category,
            expense.Date,
            expense.CreatedAt);
}
