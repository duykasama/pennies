using FluentAssertions;
using Pennies.Application.Expenses.Queries.GetExpenses;

namespace Pennies.Application.Tests.Expenses.Queries;

public class GetExpensesValidatorTests
{
    private readonly GetExpensesValidator _sut = new();

    [Fact]
    public void Validate_ValidQuery_Passes()
    {
        var result = _sut.Validate(ValidQuery());
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_MonthAndYearBothProvided_Passes()
    {
        var result = _sut.Validate(ValidQuery() with { Month = 6, Year = 2026 });
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_PageIndexZero_Fails()
    {
        var result = _sut.Validate(ValidQuery() with { PageIndex = 0 });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(GetExpensesQuery.PageIndex));
    }

    [Fact]
    public void Validate_PageSizeZero_Fails()
    {
        var result = _sut.Validate(ValidQuery() with { PageSize = 0 });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(GetExpensesQuery.PageSize));
    }

    [Fact]
    public void Validate_PageSizeOver100_Fails()
    {
        var result = _sut.Validate(ValidQuery() with { PageSize = 101 });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(GetExpensesQuery.PageSize));
    }

    [Fact]
    public void Validate_MonthWithoutYear_Fails()
    {
        var result = _sut.Validate(ValidQuery() with { Month = 6, Year = null });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(GetExpensesQuery.Year));
    }

    [Fact]
    public void Validate_YearWithoutMonth_Fails()
    {
        var result = _sut.Validate(ValidQuery() with { Month = null, Year = 2026 });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(GetExpensesQuery.Month));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(13)]
    public void Validate_MonthOutOfRange_Fails(int month)
    {
        var result = _sut.Validate(ValidQuery() with { Month = month, Year = 2026 });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(GetExpensesQuery.Month));
    }

    private static GetExpensesQuery ValidQuery() => new(
        UserId: "user-1",
        Month: null,
        Year: null,
        PageIndex: 1,
        PageSize: 20);
}
