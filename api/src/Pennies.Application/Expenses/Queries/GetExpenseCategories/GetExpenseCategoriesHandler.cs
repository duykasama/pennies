using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Queries.GetExpenseCategories;

internal sealed class GetExpenseCategoriesHandler(IExpenseLookupRepository repository)
    : IRequestHandler<GetExpenseCategoriesQuery, Result<IReadOnlyList<CategoryResponse>>>
{
    public async Task<Result<IReadOnlyList<CategoryResponse>>> Handle(
        GetExpenseCategoriesQuery request,
        CancellationToken cancellationToken)
    {
        var items = await repository.GetCategoriesAsync(request.Language, cancellationToken);
        return Result.Success<IReadOnlyList<CategoryResponse>>(
            items.Select(c => new CategoryResponse(c.Id, ResolveName(c.Translations, request.Language), c.Icon, c.DisplayOrder))
                .ToList().AsReadOnly());
    }

    private static string ResolveName(IEnumerable<ExpenseCategoryTranslation> translations, string? language) =>
        translations.FirstOrDefault(t => t.Language == language)?.Name
        ?? translations.FirstOrDefault(t => t.IsDefault)?.Name
        ?? string.Empty;
}
