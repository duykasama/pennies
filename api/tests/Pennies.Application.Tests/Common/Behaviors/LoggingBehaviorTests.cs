using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Pennies.Application.Common;
using Pennies.Application.Common.Behaviors;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Tests.Common.Behaviors;

public class LoggingBehaviorTests
{
    private readonly ILogger<TestRequest> _logger = Substitute.For<ILogger<TestRequest>>();
    private readonly LoggingBehavior<TestRequest, Result<ExpenseResponse>> _sut;

    public LoggingBehaviorTests()
    {
        _sut = new LoggingBehavior<TestRequest, Result<ExpenseResponse>>(_logger);
    }

    [Fact]
    public async Task Handle_AlwaysCallsNext()
    {
        var nextCalled = false;
        RequestHandlerDelegate<Result<ExpenseResponse>> next = _ =>
        {
            nextCalled = true;
            return Task.FromResult(Result<ExpenseResponse>.Failure(Error.None));
        };

        await _sut.Handle(new TestRequest(), next, CancellationToken.None);

        nextCalled.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_ReturnsValueFromNext()
    {
        var expected = Result<ExpenseResponse>.Failure(Error.NotFound("not found"));
        RequestHandlerDelegate<Result<ExpenseResponse>> next = _ => Task.FromResult(expected);

        var result = await _sut.Handle(new TestRequest(), next, CancellationToken.None);

        result.Should().BeSameAs(expected);
    }

    [Fact]
    public async Task Handle_LogsTwice_HandlingAndHandled()
    {
        RequestHandlerDelegate<Result<ExpenseResponse>> next = _ =>
            Task.FromResult(Result<ExpenseResponse>.Failure(Error.None));

        await _sut.Handle(new TestRequest(), next, CancellationToken.None);

        _logger.Received(2).Log(
            Arg.Any<LogLevel>(),
            Arg.Any<EventId>(),
            Arg.Any<object>(),
            Arg.Any<Exception?>(),
            Arg.Any<Func<object, Exception?, string>>());
    }
}

public sealed record TestRequest : IRequest<Result<ExpenseResponse>>;
