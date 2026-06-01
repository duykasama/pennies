using FluentAssertions;
using Pennies.Application.Expenses.Commands.CreateExpense;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Tests.Expenses.Commands;

public class CreateExpenseValidatorTests
{
    private readonly CreateExpenseValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(ValidCommand());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyTitle_Fails(string title)
    {
        var result = _sut.Validate(ValidCommand() with { Title = title });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateExpenseCommand.Title));
    }

    [Fact]
    public void Validate_TitleTooLong_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { Title = new string('a', 201) });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateExpenseCommand.Title));
    }

    [Fact]
    public void Validate_ZeroAmount_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { Amount = 0 });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateExpenseCommand.Amount));
    }

    [Fact]
    public void Validate_PositiveAmount_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { Amount = 10.00m });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateExpenseCommand.Amount));
    }

    [Fact]
    public void Validate_FutureDate_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)) });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateExpenseCommand.Date));
    }

    [Fact]
    public void Validate_InvalidCategory_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { Category = (ExpenseCategory)0 });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateExpenseCommand.Category));
    }

    [Fact]
    public void Validate_EmptyUserId_Fails()
    {
        var result = _sut.Validate(ValidCommand() with { UserId = "" });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateExpenseCommand.UserId));
    }

    private static CreateExpenseCommand ValidCommand() => new(
        UserId: "user-1",
        Title: "Groceries",
        Description: null,
        Amount: -50.00m,
        Category: ExpenseCategory.Food,
        Date: DateOnly.FromDateTime(DateTime.UtcNow));
}
