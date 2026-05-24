using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Expenses.Commands.CreateExpense;

public sealed record CreateExpenseCommand(
    string UserId,
    string Title,
    string? Description,
    decimal Amount,
    ExpenseCategory Category,
    DateOnly Date) : IRequest<Result<ExpenseResponse>>;
