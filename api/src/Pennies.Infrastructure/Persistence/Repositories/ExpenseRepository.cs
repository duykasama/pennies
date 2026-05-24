using Microsoft.EntityFrameworkCore;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence.Repositories;

internal sealed class ExpenseRepository(AppDbContext dbContext) : IExpenseRepository
{
    public async Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await dbContext.Expenses.FindAsync([id], cancellationToken);

    public async Task<IReadOnlyList<Expense>> ListByUserAsync(string userId, CancellationToken cancellationToken = default) =>
        await dbContext.Expenses
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Date)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Expense expense, CancellationToken cancellationToken = default)
    {
        await dbContext.Expenses.AddAsync(expense, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Expense expense, CancellationToken cancellationToken = default)
    {
        dbContext.Expenses.Update(expense);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Expense expense, CancellationToken cancellationToken = default)
    {
        dbContext.Expenses.Remove(expense);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
