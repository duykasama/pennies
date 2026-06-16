namespace Pennies.Domain.Common;

public abstract class Entity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public abstract class Entity<TKey>
{
    public TKey Id { get; set; } = default!;
}
