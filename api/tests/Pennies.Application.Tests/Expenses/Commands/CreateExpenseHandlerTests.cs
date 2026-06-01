using FluentAssertions;
using NSubstitute;
using Pennies.Application.Expenses.Commands.CreateExpense;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Tests.Expenses.Commands;

public class CreateExpenseHandlerTests
{
    private readonly IExpenseRepository _repository = Substitute.For<IExpenseRepository>();
    private readonly CreateExpenseHandler _sut;

    public CreateExpenseHandlerTests()
    {
        _sut = new CreateExpenseHandler(_repository);
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsSuccess()
    {
        var command = ValidCommand();

        var result = await _sut.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Title.Should().Be(command.Title);
        result.Value.Amount.Should().Be(command.Amount);
        result.Value.Category.Should().Be((int)command.Category);
        result.Value.Date.Should().Be(command.Date);
        await _repository.Received(1).AddAsync(Arg.Any<Expense>(), Arg.Any<CancellationToken>());
    }

    private static CreateExpenseCommand ValidCommand() => new(
        UserId: "user-1",
        Title: "Groceries",
        Description: null,
        Amount: -50.00m,
        Category: ExpenseCategory.Food,
        Date: DateOnly.FromDateTime(DateTime.UtcNow));
}
