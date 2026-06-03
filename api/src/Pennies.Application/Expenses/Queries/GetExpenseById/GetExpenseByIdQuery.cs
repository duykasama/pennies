using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Common.Caching;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Expenses.Queries.GetExpenseById;

public sealed record GetExpenseByIdQuery(Guid ExpenseId, string UserId)
    : IRequest<Result<ExpenseResponse>>, ICacheableQuery
{
    public string CacheKey => $"expenses:{UserId}:item:{ExpenseId}";
    public TimeSpan? Expiration => null;
}
