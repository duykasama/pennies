using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Common.Caching;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Expenses.Queries.GetExpenseCategories;

public sealed record GetExpenseCategoriesQuery : IRequest<Result<IReadOnlyList<CategoryResponse>>>, ICacheableQuery
{
    public string? Language { get; init; }
    public string CacheKey => $"expenses:categories:v3:{Language ?? "default"}";
    public TimeSpan? Expiration => null;
}
