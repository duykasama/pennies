using Pennies.Domain.Common;

namespace Pennies.Domain.Expenses;

public class Expense : Entity
{
    public string UserId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public ExpenseCategory Category { get; set; }
    public DateOnly Date { get; set; }
    public bool IsDeleted { get; set; }
}
