namespace Pennies.Domain.Expenses;

public interface IExpenseLookupRepository
{
    Task<IReadOnlyList<ExpenseCategory>> GetCategoriesAsync(string? language, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ExpenseFrequency>> GetFrequenciesAsync(string? language, CancellationToken cancellationToken = default);
}
