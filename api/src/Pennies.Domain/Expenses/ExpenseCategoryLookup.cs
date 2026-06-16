using Pennies.Domain.Common;

namespace Pennies.Domain.Expenses;

public class ExpenseCategoryLookup : Entity<int>
{
    public int DisplayOrder { get; set; }
    public bool IsDeleted { get; set; }
    public string Icon { get; set; } = string.Empty;
    public ICollection<ExpenseCategoryTranslation> Translations { get; set; } = [];
}
