using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Queries.GetExpenseFrequencies;

internal sealed class GetExpenseFrequenciesHandler(IExpenseLookupRepository repository)
    : IRequestHandler<GetExpenseFrequenciesQuery, Result<IReadOnlyList<FrequencyResponse>>>
{
    public async Task<Result<IReadOnlyList<FrequencyResponse>>> Handle(
        GetExpenseFrequenciesQuery request,
        CancellationToken cancellationToken)
    {
        var items = await repository.GetFrequenciesAsync(request.Language, cancellationToken);
        return Result.Success<IReadOnlyList<FrequencyResponse>>(
            items.Select(f => new FrequencyResponse(f.Id, ResolveName(f.Translations, request.Language), f.DisplayOrder))
                .ToList().AsReadOnly());
    }

    private static string ResolveName(IEnumerable<ExpenseFrequencyTranslation> translations, string? language) =>
        translations.FirstOrDefault(t => t.Language == language)?.Name
        ?? translations.FirstOrDefault(t => t.IsDefault)?.Name
        ?? string.Empty;
}
