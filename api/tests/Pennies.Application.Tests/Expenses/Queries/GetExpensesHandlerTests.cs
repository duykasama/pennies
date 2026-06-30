using FluentAssertions;
using NSubstitute;
using Pennies.Application.Expenses.Queries.GetExpenses;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Tests.Expenses.Queries;

public class GetExpensesHandlerTests
{
    private readonly IExpenseRepository _repository = Substitute.For<IExpenseRepository>();
    private readonly GetExpensesHandler _sut;

    public GetExpensesHandlerTests()
    {
        _sut = new GetExpensesHandler(_repository);
    }

    [Fact]
    public async Task Handle_ReturnsPagedResponse()
    {
        var expenses = Enumerable.Range(0, 10).Select(_ => CreateExpense("user-1")).ToList();
        _repository.ListByUserAsync("user-1", null, null, 1, 10, Arg.Any<CancellationToken>())
            .Returns((expenses.AsReadOnly() as IReadOnlyList<Expense>, 25));

        var result = await _sut.Handle(new GetExpensesQuery("user-1", null, null, 1, 10), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Items.Count.Should().Be(10);
        result.Value.TotalCount.Should().Be(25);
        result.Value.TotalPages.Should().Be(3);
        result.Value.PageIndex.Should().Be(1);
        result.Value.PageSize.Should().Be(10);
    }

    [Fact]
    public async Task Handle_EmptyResult_ReturnsEmptyPage()
    {
        _repository.ListByUserAsync("user-1", null, null, 1, 20, Arg.Any<CancellationToken>())
            .Returns((Array.Empty<Expense>() as IReadOnlyList<Expense>, 0));

        var result = await _sut.Handle(new GetExpensesQuery("user-1", null, null, 1, 20), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Items.Should().BeEmpty();
        result.Value.TotalCount.Should().Be(0);
        result.Value.TotalPages.Should().Be(0);
    }

    private static Expense CreateExpense(string userId) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        Title = "Test",
        Amount = -10m,
        CategoryId = 1,
        Date = DateOnly.FromDateTime(DateTime.UtcNow),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
    };
}
