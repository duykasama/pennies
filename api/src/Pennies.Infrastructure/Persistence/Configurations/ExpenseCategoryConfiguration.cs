using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence.Configurations;

internal sealed class ExpenseCategoryConfiguration : IEntityTypeConfiguration<ExpenseCategory>
{
    public void Configure(EntityTypeBuilder<ExpenseCategory> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.DisplayOrder).IsRequired();
        builder.Property(e => e.IsDeleted).IsRequired();
        builder.Property(e => e.Icon).IsRequired().HasMaxLength(10);
        builder.HasMany(e => e.Translations)
            .WithOne()
            .HasForeignKey(t => t.CategoryId);
    }
}
