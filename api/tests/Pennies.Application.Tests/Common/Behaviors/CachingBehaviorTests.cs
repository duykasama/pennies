using System.Text.Json;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using NSubstitute;
using Pennies.Application.Common;
using Pennies.Application.Common.Behaviors;
using Pennies.Application.Common.Caching;
using Pennies.Application.Expenses.DTOs;

namespace Pennies.Application.Tests.Common.Behaviors;

public class CachingBehaviorTests
{
    private readonly IDistributedCache _cache = Substitute.For<IDistributedCache>();
    private readonly IOptions<CacheSettings> _settings = Options.Create(new CacheSettings { ExpirationMinutes = 5 });
    private readonly CachingBehavior<TestCacheableQuery, Result<ExpenseResponse>> _sut;

    public CachingBehaviorTests()
    {
        _sut = new CachingBehavior<TestCacheableQuery, Result<ExpenseResponse>>(
            _cache,
            _settings,
            NullLogger<CachingBehavior<TestCacheableQuery, Result<ExpenseResponse>>>.Instance);
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        Converters = { new ResultJsonConverterFactory() }
    };

    [Fact]
    public async Task Handle_CacheHit_ReturnsDeserializedValueWithoutCallingNext()
    {
        var category = new CategoryResponse(1, "Food", "🍔");
        var expected = Result<ExpenseResponse>.Success(new ExpenseResponse(
            Guid.NewGuid(), "Groceries", null, -50m, category, null, DateOnly.FromDateTime(DateTime.UtcNow), DateTime.UtcNow, DateTime.UtcNow));
        var cachedBytes = JsonSerializer.SerializeToUtf8Bytes(expected, JsonOptions);

        _cache.GetAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(cachedBytes);

        var nextCalled = false;
        RequestHandlerDelegate<Result<ExpenseResponse>> next = _ =>
        {
            nextCalled = true;
            return Task.FromResult(Result<ExpenseResponse>.Success(new ExpenseResponse(Guid.NewGuid(), "Other", null, -1m, category, null, DateOnly.MinValue, DateTime.MinValue, DateTime.MinValue)));
        };

        var result = await _sut.Handle(new TestCacheableQuery(), next, CancellationToken.None);

        nextCalled.Should().BeFalse();
        result.IsSuccess.Should().BeTrue();
        result.Value!.Title.Should().Be("Groceries");
    }

    [Fact]
    public async Task Handle_CacheMiss_CallsNextAndStoresResult()
    {
        var response = Result<ExpenseResponse>.Success(new ExpenseResponse(
            Guid.NewGuid(), "Groceries", null, -50m, new CategoryResponse(1, "Food", "🍔"), null, DateOnly.FromDateTime(DateTime.UtcNow), DateTime.UtcNow, DateTime.UtcNow));

        _cache.GetAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns((byte[]?)null);

        var nextCalled = false;
        RequestHandlerDelegate<Result<ExpenseResponse>> next = _ =>
        {
            nextCalled = true;
            return Task.FromResult(response);
        };

        var result = await _sut.Handle(new TestCacheableQuery(), next, CancellationToken.None);

        nextCalled.Should().BeTrue();
        result.IsSuccess.Should().BeTrue();
        await _cache.Received(1).SetAsync(
            "test:cache:key",
            Arg.Any<byte[]>(),
            Arg.Any<DistributedCacheEntryOptions>(),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_NonCacheableRequest_PassesThroughWithoutCacheAccess()
    {
        var behavior = new CachingBehavior<NonCacheableQuery, Result<ExpenseResponse>>(
            _cache,
            _settings,
            NullLogger<CachingBehavior<NonCacheableQuery, Result<ExpenseResponse>>>.Instance);

        var nextCalled = false;
        RequestHandlerDelegate<Result<ExpenseResponse>> next = _ =>
        {
            nextCalled = true;
            return Task.FromResult(Result<ExpenseResponse>.Failure(Error.None));
        };

        await behavior.Handle(new NonCacheableQuery(), next, CancellationToken.None);

        nextCalled.Should().BeTrue();
        await _cache.DidNotReceive().GetAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
        await _cache.DidNotReceive().SetAsync(Arg.Any<string>(), Arg.Any<byte[]>(), Arg.Any<DistributedCacheEntryOptions>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_CacheMiss_UsesConfiguredExpiration()
    {
        var settings = Options.Create(new CacheSettings { ExpirationMinutes = 10 });
        var sut = new CachingBehavior<TestCacheableQuery, Result<ExpenseResponse>>(
            _cache, settings, NullLogger<CachingBehavior<TestCacheableQuery, Result<ExpenseResponse>>>.Instance);

        _cache.GetAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns((byte[]?)null);

        await sut.Handle(new TestCacheableQuery(), _ => Task.FromResult(Result<ExpenseResponse>.Failure(Error.None)), CancellationToken.None);

        await _cache.Received(1).SetAsync(
            Arg.Any<string>(),
            Arg.Any<byte[]>(),
            Arg.Is<DistributedCacheEntryOptions>(o =>
                o.AbsoluteExpirationRelativeToNow == TimeSpan.FromMinutes(10)),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_QueryWithCustomExpiration_UsesQueryExpiration()
    {
        var behavior = new CachingBehavior<TestCacheableQueryWithExpiration, Result<ExpenseResponse>>(
            _cache,
            _settings,
            NullLogger<CachingBehavior<TestCacheableQueryWithExpiration, Result<ExpenseResponse>>>.Instance);

        _cache.GetAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns((byte[]?)null);

        await behavior.Handle(
            new TestCacheableQueryWithExpiration(),
            _ => Task.FromResult(Result<ExpenseResponse>.Failure(Error.None)),
            CancellationToken.None);

        await _cache.Received(1).SetAsync(
            Arg.Any<string>(),
            Arg.Any<byte[]>(),
            Arg.Is<DistributedCacheEntryOptions>(o =>
                o.AbsoluteExpirationRelativeToNow == TimeSpan.FromMinutes(1)),
            Arg.Any<CancellationToken>());
    }
}

public sealed record TestCacheableQuery : IRequest<Result<ExpenseResponse>>, ICacheableQuery
{
    public string CacheKey => "test:cache:key";
    public TimeSpan? Expiration => null;
}

public sealed record TestCacheableQueryWithExpiration : IRequest<Result<ExpenseResponse>>, ICacheableQuery
{
    public string CacheKey => "test:custom:key";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(1);
}

public sealed record NonCacheableQuery : IRequest<Result<ExpenseResponse>>;
