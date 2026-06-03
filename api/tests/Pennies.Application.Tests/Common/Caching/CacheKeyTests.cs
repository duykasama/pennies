using FluentAssertions;
using Pennies.Application.Expenses.Queries.GetExpenseById;
using Pennies.Application.Expenses.Queries.GetExpenses;

namespace Pennies.Application.Tests.Common.Caching;

public class CacheKeyTests
{
    [Fact]
    public void GetExpensesQuery_CacheKey_IncludesAllParameters()
    {
        var query = new GetExpensesQuery("user-1", 3, 2026, 2, 20);

        query.CacheKey.Should().Be("expenses:user-1:list:m=3:y=2026:p=2:s=20");
    }

    [Fact]
    public void GetExpensesQuery_CacheKey_NullMonthAndYear_UsesZero()
    {
        var query = new GetExpensesQuery("user-1", null, null, 1, 10);

        query.CacheKey.Should().Be("expenses:user-1:list:m=0:y=0:p=1:s=10");
    }

    [Fact]
    public void GetExpensesQuery_CacheKey_DifferentUsers_ProduceDifferentKeys()
    {
        var queryA = new GetExpensesQuery("user-A", null, null, 1, 10);
        var queryB = new GetExpensesQuery("user-B", null, null, 1, 10);

        queryA.CacheKey.Should().NotBe(queryB.CacheKey);
    }

    [Fact]
    public void GetExpensesQuery_CacheKey_DifferentPages_ProduceDifferentKeys()
    {
        var page1 = new GetExpensesQuery("user-1", null, null, 1, 10);
        var page2 = new GetExpensesQuery("user-1", null, null, 2, 10);

        page1.CacheKey.Should().NotBe(page2.CacheKey);
    }

    [Fact]
    public void GetExpensesQuery_Expiration_IsNull()
    {
        var query = new GetExpensesQuery("user-1", null, null, 1, 10);

        query.Expiration.Should().BeNull();
    }

    [Fact]
    public void GetExpenseByIdQuery_CacheKey_IncludesExpenseIdAndUserId()
    {
        var expenseId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa6");
        var query = new GetExpenseByIdQuery(expenseId, "user-1");

        query.CacheKey.Should().Be($"expenses:user-1:item:{expenseId}");
    }

    [Fact]
    public void GetExpenseByIdQuery_CacheKey_SameExpense_DifferentUsers_ProduceDifferentKeys()
    {
        var expenseId = Guid.NewGuid();
        var queryA = new GetExpenseByIdQuery(expenseId, "user-A");
        var queryB = new GetExpenseByIdQuery(expenseId, "user-B");

        queryA.CacheKey.Should().NotBe(queryB.CacheKey);
    }

    [Fact]
    public void GetExpenseByIdQuery_Expiration_IsNull()
    {
        var query = new GetExpenseByIdQuery(Guid.NewGuid(), "user-1");

        query.Expiration.Should().BeNull();
    }
}
