using Pennies.Domain.Common;

namespace Pennies.Domain.Expenses;

public class ExpenseCategoryTranslation : Entity<int>
{
    public int CategoryId { get; set; }
    public string Language { get; set; } = default!;
    public bool IsDefault { get; set; }
    public string Name { get; set; } = default!;
}
