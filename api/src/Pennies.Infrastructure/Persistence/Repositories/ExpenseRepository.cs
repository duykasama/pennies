using Microsoft.EntityFrameworkCore;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence.Repositories;

internal sealed class ExpenseRepository(AppDbContext dbContext) : IExpenseRepository
{
    public async Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await dbContext.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted, cancellationToken);

    public async Task<(IReadOnlyList<Expense> Items, int TotalCount)> ListByUserAsync(
        string userId, int? month, int? year, int pageIndex, int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.Expenses
            .Where(e => e.UserId == userId && !e.IsDeleted);

        if (month.HasValue && year.HasValue)
            query = query.Where(e => e.Date.Month == month.Value && e.Date.Year == year.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(e => e.Date)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

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
        expense.IsDeleted = true;
        expense.UpdatedAt = DateTime.UtcNow;
        dbContext.Expenses.Update(expense);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
