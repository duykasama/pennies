using MediatR;
using Pennies.Application.Common;

namespace Pennies.Application.Expenses.Commands.DeleteExpense;

public sealed record DeleteExpenseCommand(Guid ExpenseId, string UserId) : IRequest<Result<bool>>;
