using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Expenses.Queries.GetExpenses;

public sealed record GetExpensesQuery(string UserId) : IRequest<Result<IReadOnlyList<ExpenseResponse>>>;
