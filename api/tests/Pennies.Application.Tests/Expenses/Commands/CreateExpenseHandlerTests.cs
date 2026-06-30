using FluentAssertions;
using NSubstitute;
using Pennies.Application.Common.Caching;
using Pennies.Application.Expenses.Commands.CreateExpense;
using Pennies.Domain.Expenses;

namespace Pennies.Application.Tests.Expenses.Commands;

public class CreateExpenseHandlerTests
{
    private readonly IExpenseRepository _repository = Substitute.For<IExpenseRepository>();
    private readonly ICacheInvalidator _cacheInvalidator = Substitute.For<ICacheInvalidator>();
    private readonly CreateExpenseHandler _sut;

    public CreateExpenseHandlerTests()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(callInfo => new Expense
            {
                Id = callInfo.Arg<Guid>(),
                UserId = "user-1",
                Title = "Groceries",
                Amount = -50.00m,
                CategoryId = 1,
                Date = DateOnly.FromDateTime(DateTime.UtcNow),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            });
        _sut = new CreateExpenseHandler(_repository, _cacheInvalidator);
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsSuccess()
    {
        var command = ValidCommand();

        var result = await _sut.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Title.Should().Be(command.Title);
        result.Value.Amount.Should().Be(command.Amount);
        result.Value.Category.Id.Should().Be(command.CategoryId);
        result.Value.Date.Should().Be(command.Date);
        await _repository.Received(1).AddAsync(Arg.Any<Expense>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_ValidCommand_InvalidatesListCache()
    {
        var command = ValidCommand();

        await _sut.Handle(command, CancellationToken.None);

        await _cacheInvalidator.Received(1)
            .InvalidateAsync($"expenses:{command.UserId}:list:*", Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_ValidCommand_WithFrequency_PersistsFrequency()
    {
        var command = ValidCommand() with { FrequencyId = 1 };
        Expense? captured = null;
        await _repository.AddAsync(Arg.Do<Expense>(e => captured = e), Arg.Any<CancellationToken>());

        await _sut.Handle(command, CancellationToken.None);

        captured!.FrequencyId.Should().Be(1);
    }

    private static CreateExpenseCommand ValidCommand() => new(
        UserId: "user-1",
        Title: "Groceries",
        Description: null,
        Amount: -50.00m,
        CategoryId: 1,
        FrequencyId: null,
        Date: DateOnly.FromDateTime(DateTime.UtcNow));
}
