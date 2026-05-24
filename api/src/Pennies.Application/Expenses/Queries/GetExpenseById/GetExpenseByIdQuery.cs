using MediatR;
using Pennies.Application.Common;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Expenses.Queries.GetExpenseById;

public sealed record GetExpenseByIdQuery(Guid ExpenseId, string UserId) : IRequest<Result<ExpenseResponse>>;
