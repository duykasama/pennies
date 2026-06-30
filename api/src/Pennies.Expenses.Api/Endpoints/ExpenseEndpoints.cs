using System.Security.Claims;
using MediatR;
using Pennies.Expenses.Api.Extensions;
using Pennies.Application.Expenses.Commands.CreateExpense;
using Pennies.Application.Expenses.Commands.DeleteExpense;
using Pennies.Application.Expenses.Commands.UpdateExpense;
using Pennies.Application.Expenses.Queries.GetExpenseById;
using Pennies.Application.Expenses.Queries.GetExpenseCategories;
using Pennies.Application.Expenses.Queries.GetExpenseFrequencies;
using Pennies.Application.Expenses.Queries.GetExpenses;
namespace Pennies.Expenses.Api.Endpoints;

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
        group.MapPut("/{id:guid}", UpdateExpense);

        var lookupGroup = app.MapGroup("/expenses").WithTags("Expenses");
        lookupGroup.MapGet("/categories", GetCategories);
        lookupGroup.MapGet("/frequencies", GetFrequencies);

        return app;
    }

    private static async Task<IResult> GetExpenses(
        ClaimsPrincipal user, ISender mediator,
        int pageIndex = 1, int pageSize = 20,
        int? month = null, int? year = null)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return (await mediator.Send(new GetExpensesQuery(userId, month, year, pageIndex, pageSize)))
            .ToHttpResult();
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
            request.CategoryId,
            request.FrequencyId,
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

    private static async Task<IResult> UpdateExpense(
        Guid id, UpdateExpenseRequest request, ClaimsPrincipal user, ISender mediator)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var command = new UpdateExpenseCommand(
            id, userId,
            request.Title, request.Description, request.Amount,
            request.CategoryId, request.FrequencyId, request.Date, request.UpdatedAt);
        return (await mediator.Send(command)).ToHttpResult();
    }

    private static async Task<IResult> GetCategories(HttpContext ctx, ISender mediator, string? lang = null) =>
        (await mediator.Send(new GetExpenseCategoriesQuery { Language = lang ?? ParseAcceptLanguage(ctx) }))
            .ToHttpResult();

    private static async Task<IResult> GetFrequencies(HttpContext ctx, ISender mediator, string? lang = null) =>
        (await mediator.Send(new GetExpenseFrequenciesQuery { Language = lang ?? ParseAcceptLanguage(ctx) }))
            .ToHttpResult();

    private static string? ParseAcceptLanguage(HttpContext ctx)
    {
        var header = ctx.Request.Headers.AcceptLanguage.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(header)) return null;
        return header.Split(',')[0].Split(';')[0].Trim();
    }
}

public sealed record CreateExpenseRequest(
    string Title,
    string? Description,
    decimal Amount,
    int CategoryId,
    int? FrequencyId,
    DateOnly Date);

public sealed record UpdateExpenseRequest(
    string Title,
    string? Description,
    decimal Amount,
    int CategoryId,
    int? FrequencyId,
    DateOnly Date,
    DateTime UpdatedAt);
