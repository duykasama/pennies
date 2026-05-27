using System.Security.Claims;
using MediatR;
using Pennies.Core.Api.Extensions;
using Pennies.Application.Expenses.Commands.CreateExpense;
using Pennies.Application.Expenses.Commands.DeleteExpense;
using Pennies.Application.Expenses.Queries.GetExpenseById;
using Pennies.Application.Expenses.Queries.GetExpenses;
using Pennies.Domain.Expenses;

namespace Pennies.Core.Api.Endpoints;

public static class ExpenseEndpoints
{
    public static IEndpointRouteBuilder MapExpenseEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/expenses")
            .RequireAuthorization()
            .WithTags("Expenses");

        group.MapGet("/", GetExpenses);
        group.MapGet("/{id:guid}", GetExpenseById);
        group.MapPost("/", CreateExpense);
        group.MapDelete("/{id:guid}", DeleteExpense);

        return app;
    }

    private static async Task<IResult> GetExpenses(ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await mediator.Send(new GetExpensesQuery(userId));
        return result.ToHttpResult();
    }

    private static async Task<IResult> GetExpenseById(Guid id, ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await mediator.Send(new GetExpenseByIdQuery(id, userId));
        return result.ToHttpResult();
    }

    private static async Task<IResult> CreateExpense(
        CreateExpenseRequest request,
        ClaimsPrincipal user,
        ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var command = new CreateExpenseCommand(
            userId,
            request.Title,
            request.Description,
            request.Amount,
            request.Category,
            request.Date);
        var result = await mediator.Send(command);
        return result.ToHttpResult(201);
    }

    private static async Task<IResult> DeleteExpense(Guid id, ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await mediator.Send(new DeleteExpenseCommand(id, userId));
        return result.ToHttpResult();
    }
}

public sealed record CreateExpenseRequest(
    string Title,
    string? Description,
    decimal Amount,
    ExpenseCategory Category,
    DateOnly Date);
