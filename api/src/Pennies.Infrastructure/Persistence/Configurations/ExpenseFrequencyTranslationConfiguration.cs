using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence.Configurations;

internal sealed class ExpenseFrequencyTranslationConfiguration : IEntityTypeConfiguration<ExpenseFrequencyTranslation>
{
    public void Configure(EntityTypeBuilder<ExpenseFrequencyTranslation> builder)
    {
        builder.ToTable("ExpenseFrequencyTranslations");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Language).IsRequired().HasMaxLength(10);
        builder.Property(e => e.Name).IsRequired().HasMaxLength(100);
        builder.Property(e => e.IsDefault).IsRequired();
    }
}
