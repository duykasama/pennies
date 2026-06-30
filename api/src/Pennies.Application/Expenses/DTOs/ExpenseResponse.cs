using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.DTOs;

public sealed record ExpenseResponse(
    Guid Id,
    string Title,
    string? Description,
    decimal Amount,
    CategoryResponse Category,
    LookupResponse? Frequency,
    DateOnly Date,
    DateTime CreatedAt,
    DateTime UpdatedAt);

internal static class ExpenseMappings
{
    internal static ExpenseResponse ToResponse(this Expense expense) =>
        new(expense.Id,
            expense.Title,
            expense.Description,
            expense.Amount,
            expense.Category is not null
                ? new CategoryResponse(expense.CategoryId, ResolveDefault(expense.Category.Translations), expense.Category.Icon, expense.Category.DisplayOrder)
                : new CategoryResponse(expense.CategoryId, string.Empty, string.Empty, 0),
            expense.FrequencyId.HasValue && expense.Frequency is not null
                ? new LookupResponse(expense.FrequencyId.Value, ResolveDefault(expense.Frequency.Translations))
                : null,
            expense.Date,
            expense.CreatedAt,
            expense.UpdatedAt);

    private static string ResolveDefault(IEnumerable<ExpenseCategoryTranslation> translations) =>
        translations.FirstOrDefault(t => t.IsDefault)?.Name ?? string.Empty;

    private static string ResolveDefault(IEnumerable<ExpenseFrequencyTranslation> translations) =>
        translations.FirstOrDefault(t => t.IsDefault)?.Name ?? string.Empty;
}
