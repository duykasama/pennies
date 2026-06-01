using FluentAssertions;
using NSubstitute;
using Pennies.Application.Expenses.Commands.DeleteExpense;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Tests.Expenses.Commands;

public class DeleteExpenseHandlerTests
{
    private readonly IExpenseRepository _repository = Substitute.For<IExpenseRepository>();
    private readonly DeleteExpenseHandler _sut;

    public DeleteExpenseHandlerTests()
    {
        _sut = new DeleteExpenseHandler(_repository);
    }

    [Fact]
    public async Task Handle_ExpenseNotFound_ReturnsNotFound()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Expense?)null);

        var result = await _sut.Handle(new DeleteExpenseCommand(Guid.NewGuid(), "user-1"), CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task Handle_DifferentUser_ReturnsUnauthorized()
    {
        var expense = CreateExpense("owner-user");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);

        var result = await _sut.Handle(new DeleteExpenseCommand(expense.Id, "other-user"), CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsSuccess()
    {
        var expense = CreateExpense("user-1");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);

        var result = await _sut.Handle(new DeleteExpenseCommand(expense.Id, "user-1"), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeTrue();
        await _repository.Received(1).DeleteAsync(expense, Arg.Any<CancellationToken>());
    }

    private static Expense CreateExpense(string userId) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        Title = "Test",
        Amount = -10m,
        Category = ExpenseCategory.Food,
        Date = DateOnly.FromDateTime(DateTime.UtcNow),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
    };
}
