using Microsoft.EntityFrameworkCore;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<ExpenseCategoryLookup> ExpenseCategories => Set<ExpenseCategoryLookup>();
    public DbSet<ExpenseFrequencyLookup> ExpenseFrequencies => Set<ExpenseFrequencyLookup>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
