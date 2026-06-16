using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence.Configurations;

internal sealed class ExpenseCategoryTranslationConfiguration : IEntityTypeConfiguration<ExpenseCategoryTranslation>
{
    public void Configure(EntityTypeBuilder<ExpenseCategoryTranslation> builder)
    {
        builder.ToTable("ExpenseCategoryTranslations");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Language).IsRequired().HasMaxLength(10);
        builder.Property(e => e.Name).IsRequired().HasMaxLength(100);
        builder.Property(e => e.IsDefault).IsRequired();
    }
}
