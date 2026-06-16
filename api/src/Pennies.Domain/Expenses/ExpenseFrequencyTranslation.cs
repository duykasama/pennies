using Pennies.Domain.Common;

namespace Pennies.Domain.Expenses;

public class ExpenseFrequencyTranslation : Entity<int>
{
    public int FrequencyId { get; set; }
    public string Language { get; set; } = default!;
    public bool IsDefault { get; set; }
    public string Name { get; set; } = default!;
}
