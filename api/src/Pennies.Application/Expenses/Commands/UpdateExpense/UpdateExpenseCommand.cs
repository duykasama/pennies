using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Commands.UpdateExpense;

public sealed record UpdateExpenseCommand(
    Guid ExpenseId,
    string UserId,
    string Title,
    string? Description,
    decimal Amount,
    ExpenseCategory Category,
    int? Frequency,
    DateOnly Date,
    DateTime UpdatedAt) : IRequest<Result<ExpenseResponse>>;
