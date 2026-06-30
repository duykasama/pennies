using Pennies.Domain.Common;

namespace Pennies.Domain.Expenses;

public class ExpenseFrequency : Entity<int>
{
    public string Name { get; set; } = default!;
    public int DisplayOrder { get; set; }
    public bool IsDeleted { get; set; }
    public ICollection<ExpenseFrequencyTranslation> Translations { get; set; } = [];
}
