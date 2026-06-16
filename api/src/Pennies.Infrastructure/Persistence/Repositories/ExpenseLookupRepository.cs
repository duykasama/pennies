using Microsoft.EntityFrameworkCore;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence.Repositories;

internal sealed class ExpenseLookupRepository(AppDbContext dbContext) : IExpenseLookupRepository
{
    public async Task<IReadOnlyList<ExpenseCategoryLookup>> GetCategoriesAsync(string? language, CancellationToken cancellationToken = default) =>
        await dbContext.ExpenseCategories
            .Where(e => !e.IsDeleted)
            .Include(e => e.Translations)
            .OrderBy(e => e.DisplayOrder)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<ExpenseFrequencyLookup>> GetFrequenciesAsync(string? language, CancellationToken cancellationToken = default) =>
        await dbContext.ExpenseFrequencies
            .Where(e => !e.IsDeleted)
            .Include(e => e.Translations)
            .OrderBy(e => e.DisplayOrder)
            .ToListAsync(cancellationToken);
}
