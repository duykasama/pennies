using FluentAssertions;
using NSubstitute;
using Pennies.Application.Common.Caching;
using Pennies.Application.Expenses.Commands.UpdateExpense;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Tests.Expenses.Commands;

public class UpdateExpenseHandlerTests
{
    private readonly IExpenseRepository _repository = Substitute.For<IExpenseRepository>();
    private readonly IExpenseLookupRepository _lookupRepository = Substitute.For<IExpenseLookupRepository>();
    private readonly ICacheInvalidator _cacheInvalidator = Substitute.For<ICacheInvalidator>();
    private readonly UpdateExpenseHandler _sut;

    public UpdateExpenseHandlerTests()
    {
        _lookupRepository.GetCategoriesAsync(Arg.Any<string?>(), Arg.Any<CancellationToken>())
            .Returns(Array.Empty<ExpenseCategoryLookup>() as IReadOnlyList<ExpenseCategoryLookup>);
        _lookupRepository.GetFrequenciesAsync(Arg.Any<string?>(), Arg.Any<CancellationToken>())
            .Returns(Array.Empty<ExpenseFrequencyLookup>() as IReadOnlyList<ExpenseFrequencyLookup>);
        _sut = new UpdateExpenseHandler(_repository, _lookupRepository, _cacheInvalidator);
    }

    [Fact]
    public async Task Handle_ExpenseNotFound_ReturnsNotFound()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Expense?)null);

        var result = await _sut.Handle(ValidCommand(), CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task Handle_DifferentUser_ReturnsUnauthorized()
    {
        var expense = CreateExpense("owner-user");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);

        var result = await _sut.Handle(ValidCommand(expenseId: expense.Id, userId: "other-user", updatedAt: expense.UpdatedAt), CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task Handle_StaleUpdatedAt_ReturnsConflict()
    {
        var expense = CreateExpense("user-1");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);

        var staleUpdatedAt = expense.UpdatedAt.AddSeconds(-1);
        var result = await _sut.Handle(ValidCommand(expenseId: expense.Id, updatedAt: staleUpdatedAt), CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Conflict");
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsUpdatedExpense()
    {
        var expense = CreateExpense("user-1");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);
        var command = ValidCommand(expenseId: expense.Id, updatedAt: expense.UpdatedAt);

        var result = await _sut.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Title.Should().Be(command.Title);
        result.Value.Amount.Should().Be(command.Amount);
        await _repository.Received(1).UpdateAsync(expense, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_ValidCommand_InvalidatesListAndItemCache()
    {
        var expense = CreateExpense("user-1");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);
        var command = ValidCommand(expenseId: expense.Id, updatedAt: expense.UpdatedAt);

        await _sut.Handle(command, CancellationToken.None);

        await _cacheInvalidator.Received(1)
            .InvalidateAsync($"expenses:user-1:list:*", Arg.Any<CancellationToken>());
        await _cacheInvalidator.Received(1)
            .InvalidateAsync($"expenses:user-1:item:{expense.Id}", Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_ExpenseNotFound_DoesNotInvalidateCache()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Expense?)null);

        await _sut.Handle(ValidCommand(), CancellationToken.None);

        await _cacheInvalidator.DidNotReceive()
            .InvalidateAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_ValidCommand_WithFrequency_PersistsFrequency()
    {
        var expense = CreateExpense("user-1");
        _repository.GetByIdAsync(expense.Id, Arg.Any<CancellationToken>()).Returns(expense);
        var command = ValidCommand(expenseId: expense.Id, updatedAt: expense.UpdatedAt) with { Frequency = 2 };

        await _sut.Handle(command, CancellationToken.None);

        expense.Frequency.Should().Be(2);
    }

    private static UpdateExpenseCommand ValidCommand(
        Guid? expenseId = null,
        string userId = "user-1",
        DateTime? updatedAt = null) => new(
        ExpenseId: expenseId ?? Guid.NewGuid(),
        UserId: userId,
        Title: "Updated Title",
        Description: null,
        Amount: -75.00m,
        Category: ExpenseCategory.Shopping,
        Frequency: null,
        Date: DateOnly.FromDateTime(DateTime.UtcNow),
        UpdatedAt: updatedAt ?? DateTime.UtcNow);

    private static Expense CreateExpense(string userId)
    {
        var updatedAt = DateTime.UtcNow;
        return new Expense
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Original Title",
            Amount = -50m,
            Category = ExpenseCategory.Food,
            Date = DateOnly.FromDateTime(DateTime.UtcNow),
            CreatedAt = updatedAt,
            UpdatedAt = updatedAt,
        };
    }
}
