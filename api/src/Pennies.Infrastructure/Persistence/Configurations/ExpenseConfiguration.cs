using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pennies.Domain.Expenses;

namespace Pennies.Infrastructure.Persistence.Configurations;

internal sealed class ExpenseConfiguration : IEntityTypeConfiguration<Expense>
{
    public void Configure(EntityTypeBuilder<Expense> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .HasMaxLength(1000);

        builder.Property(e => e.Amount)
            .HasPrecision(18, 2);

        builder.Property(e => e.UserId)
            .IsRequired();

        builder.Property(e => e.IsDeleted)
            .IsRequired();

        builder.Property(e => e.CategoryId)
            .IsRequired();

        builder.HasOne(e => e.Category)
            .WithMany()
            .HasForeignKey(e => e.CategoryId);

        builder.HasOne(e => e.Frequency)
            .WithMany()
            .HasForeignKey(e => e.FrequencyId);
    }
}
