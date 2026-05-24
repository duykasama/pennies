namespace Pennies.Domain.Expenses;

public interface IExpenseRepository
{
    Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Expense>> ListByUserAsync(string userId, CancellationToken cancellationToken = default);
    Task AddAsync(Expense expense, CancellationToken cancellationToken = default);
    Task UpdateAsync(Expense expense, CancellationToken cancellationToken = default);
    Task DeleteAsync(Expense expense, CancellationToken cancellationToken = default);
}
