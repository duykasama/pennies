using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Common.Caching;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Expenses.Queries.GetExpenseFrequencies;

public sealed record GetExpenseFrequenciesQuery : IRequest<Result<IReadOnlyList<LookupResponse>>>, ICacheableQuery
{
    public string? Language { get; init; }
    public string CacheKey => $"expenses:frequencies:{Language ?? "default"}";
    public TimeSpan? Expiration => null;
}
