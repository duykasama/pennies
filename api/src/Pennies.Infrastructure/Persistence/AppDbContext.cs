using Microsoft.EntityFrameworkCore;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<ExpenseCategory> ExpenseCategories => Set<ExpenseCategory>();
    public DbSet<ExpenseFrequency> ExpenseFrequencies => Set<ExpenseFrequency>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
