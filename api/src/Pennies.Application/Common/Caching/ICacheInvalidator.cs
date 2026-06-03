namespace Pennies.Application.Common.Caching;

public interface ICacheInvalidator
{
    Task InvalidateAsync(string pattern, CancellationToken cancellationToken = default);
}
