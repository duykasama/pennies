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
    internal static ExpenseResponse ToResponse(
        this Expense expense,
        IReadOnlyDictionary<int, ExpenseCategoryLookup> categories,
        IReadOnlyDictionary<int, ExpenseFrequencyLookup> frequencies) =>
        new(expense.Id,
            expense.Title,
            expense.Description,
            expense.Amount,
            categories.TryGetValue((int)expense.Category, out var cat)
                ? new CategoryResponse((int)expense.Category, ResolveDefault(cat.Translations), cat.Icon)
                : new CategoryResponse((int)expense.Category, string.Empty, string.Empty),
            expense.Frequency.HasValue && frequencies.TryGetValue(expense.Frequency.Value, out var freq)
                ? new LookupResponse(expense.Frequency.Value, ResolveDefault(freq.Translations))
                : null,
            expense.Date,
            expense.CreatedAt,
            expense.UpdatedAt);

    private static string ResolveDefault(IEnumerable<ExpenseCategoryTranslation> translations) =>
        translations.FirstOrDefault(t => t.IsDefault)?.Name ?? string.Empty;

    private static string ResolveDefault(IEnumerable<ExpenseFrequencyTranslation> translations) =>
        translations.FirstOrDefault(t => t.IsDefault)?.Name ?? string.Empty;
}
