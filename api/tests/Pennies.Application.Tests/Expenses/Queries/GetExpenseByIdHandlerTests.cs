using FluentAssertions;
using NSubstitute;
using Pennies.Application.Expenses.Queries.GetExpenseById;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Tests.Expenses.Queries;

public class GetExpenseByIdHandlerTests
{
    private readonly IExpenseRepository _repository = Substitute.For<IExpenseRepository>();
    private readonly GetExpenseByIdHandler _sut;

    public GetExpenseByIdHandlerTests()
    {
        _sut = new GetExpenseByIdHandler(_repository);
    }

    [Fact]
    public async Task Handle_ExpenseNotFound_ReturnsNotFound()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Expense?)null);

        var result = await _sut.Handle(new GetExpenseByIdQuery(Guid.NewGuid(), "user-1"), CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task Handle_DifferentUser_ReturnsNotFound()
    {
        var expense = CreateExpense("owner-user");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);

        var result = await _sut.Handle(new GetExpenseByIdQuery(expense.Id, "other-user"), CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task Handle_ValidQuery_ReturnsExpense()
    {
        var expense = CreateExpense("user-1");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);

        var result = await _sut.Handle(new GetExpenseByIdQuery(expense.Id, "user-1"), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Id.Should().Be(expense.Id);
        result.Value.Title.Should().Be(expense.Title);
    }

    private static Expense CreateExpense(string userId) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        Title = "Test Expense",
        Amount = -30m,
        Category = ExpenseCategory.Transport,
        Date = DateOnly.FromDateTime(DateTime.UtcNow),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
    };
}
