namespace Pennies.Domain.Expenses;

public interface IExpenseLookupRepository
{
    Task<IReadOnlyList<ExpenseCategoryLookup>> GetCategoriesAsync(string? language, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ExpenseFrequencyLookup>> GetFrequenciesAsync(string? language, CancellationToken cancellationToken = default);
}
