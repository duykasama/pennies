using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Expenses.Commands.CreateExpense;

public sealed record CreateExpenseCommand(
    string UserId,
    string Title,
    string? Description,
    decimal Amount,
    int CategoryId,
    int? FrequencyId,
    DateOnly Date) : IRequest<Result<ExpenseResponse>>;
