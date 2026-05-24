using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.DTOs;

public sealed record ExpenseResponse(
    Guid Id,
    string Title,
    string? Description,
    decimal Amount,
    string Category,
    DateOnly Date,
    DateTime CreatedAt);

internal static class ExpenseMappings
{
    internal static ExpenseResponse ToResponse(this Expense expense) =>
        new(expense.Id,
            expense.Title,
            expense.Description,
            expense.Amount,
            expense.Category.ToString(),
            expense.Date,
            expense.CreatedAt);
}
