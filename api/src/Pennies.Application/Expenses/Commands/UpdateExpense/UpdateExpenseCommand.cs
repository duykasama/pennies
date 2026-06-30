using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Expenses.Commands.UpdateExpense;

public sealed record UpdateExpenseCommand(
    Guid ExpenseId,
    string UserId,
    string Title,
    string? Description,
    decimal Amount,
    int CategoryId,
    int? FrequencyId,
    DateOnly Date,
    DateTime UpdatedAt) : IRequest<Result<ExpenseResponse>>;
