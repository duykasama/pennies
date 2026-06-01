using FluentAssertions;
using Pennies.Application.Expenses.Commands.DeleteExpense;

namespace Pennies.Application.Tests.Expenses.Commands;

public class DeleteExpenseValidatorTests
{
    private readonly DeleteExpenseValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(new DeleteExpenseCommand(Guid.NewGuid(), "user-1"));
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyExpenseId_Fails()
    {
        var result = _sut.Validate(new DeleteExpenseCommand(Guid.Empty, "user-1"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(DeleteExpenseCommand.ExpenseId));
    }

    [Fact]
    public void Validate_EmptyUserId_Fails()
    {
        var result = _sut.Validate(new DeleteExpenseCommand(Guid.NewGuid(), ""));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(DeleteExpenseCommand.UserId));
    }
}
