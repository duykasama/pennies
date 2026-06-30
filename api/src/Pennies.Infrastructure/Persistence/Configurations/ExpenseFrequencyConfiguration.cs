using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence.Configurations;

internal sealed class ExpenseFrequencyConfiguration : IEntityTypeConfiguration<ExpenseFrequency>
{
    public void Configure(EntityTypeBuilder<ExpenseFrequency> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Name).IsRequired().HasMaxLength(50);
        builder.Property(e => e.DisplayOrder).IsRequired();
        builder.Property(e => e.IsDeleted).IsRequired();
        builder.HasMany(e => e.Translations)
            .WithOne()
            .HasForeignKey(t => t.FrequencyId);
    }
}
