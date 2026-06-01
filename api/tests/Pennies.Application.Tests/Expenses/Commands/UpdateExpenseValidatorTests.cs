using FluentAssertions;
using Pennies.Application.Expenses.Commands.UpdateExpense;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Tests.Expenses.Commands;

public class UpdateExpenseValidatorTests
{
    private readonly UpdateExpenseValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(ValidCommand());
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyExpenseId_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { ExpenseId = Guid.Empty });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateExpenseCommand.ExpenseId));
    }

    [Fact]
    public void Validate_EmptyUserId_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { UserId = "" });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateExpenseCommand.UserId));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyTitle_Fails(string title)
    {
        var result = _sut.Validate(ValidCommand() with { Title = title });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateExpenseCommand.Title));
    }

    [Fact]
    public void Validate_ZeroAmount_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { Amount = 0 });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateExpenseCommand.Amount));
    }

    [Fact]
    public void Validate_PositiveAmount_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { Amount = 10.00m });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateExpenseCommand.Amount));
    }

    [Fact]
    public void Validate_EmptyUpdatedAt_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { UpdatedAt = default });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateExpenseCommand.UpdatedAt));
    }

    private static UpdateExpenseCommand ValidCommand() => new(
        ExpenseId: Guid.NewGuid(),
        UserId: "user-1",
        Title: "Groceries",
        Description: null,
        Amount: -50.00m,
        Category: ExpenseCategory.Food,
        Date: DateOnly.FromDateTime(DateTime.UtcNow),
        UpdatedAt: DateTime.UtcNow);
}
