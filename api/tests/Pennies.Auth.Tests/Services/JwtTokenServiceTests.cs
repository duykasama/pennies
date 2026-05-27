using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using NSubstitute;
using Pennies.Auth.Application.Entities;
using Pennies.Auth.Application.Services;

namespace Pennies.Auth.Tests.Services;

public class JwtTokenServiceTests
{
    private const string Secret = "test-secret-key-must-be-at-least-32-characters!";
    private const string Issuer = "test-issuer";
    private const string Audience = "test-audience";

    private readonly JwtTokenService _sut;

    public JwtTokenServiceTests()
    {
        var config = Substitute.For<IConfiguration>();
        config["Jwt:Secret"].Returns(Secret);
        config["Jwt:Issuer"].Returns(Issuer);
        config["Jwt:Audience"].Returns(Audience);
        _sut = new JwtTokenService(config);
    }

    [Fact]
    public void GenerateAccessToken_SetsSubjectToUserId()
    {
        var user = CreateUser();

        var jwt = Parse(_sut.GenerateAccessToken(user));

        jwt.Subject.Should().Be(user.Id);
    }

    [Fact]
    public void GenerateAccessToken_SetsEmailClaim()
    {
        var user = CreateUser();

        var jwt = Parse(_sut.GenerateAccessToken(user));

        jwt.GetClaim(JwtRegisteredClaimNames.Email).Value.Should().Be(user.Email);
    }

    [Fact]
    public void GenerateAccessToken_SetsDisplayNameClaim()
    {
        var user = CreateUser();

        var jwt = Parse(_sut.GenerateAccessToken(user));

        jwt.GetClaim("displayName").Value.Should().Be(user.DisplayName);
    }

    [Fact]
    public void GenerateAccessToken_SetsJti()
    {
        var jwt = Parse(_sut.GenerateAccessToken(CreateUser()));

        jwt.GetClaim(JwtRegisteredClaimNames.Jti).Value.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void GenerateAccessToken_GeneratesUniqueJtiEachCall()
    {
        var user = CreateUser();

        var jti1 = Parse(_sut.GenerateAccessToken(user)).GetClaim(JwtRegisteredClaimNames.Jti).Value;
        var jti2 = Parse(_sut.GenerateAccessToken(user)).GetClaim(JwtRegisteredClaimNames.Jti).Value;

        jti1.Should().NotBe(jti2);
    }

    [Fact]
    public void GenerateAccessToken_SetsIssuer()
    {
        var jwt = Parse(_sut.GenerateAccessToken(CreateUser()));

        jwt.Issuer.Should().Be(Issuer);
    }

    [Fact]
    public void GenerateAccessToken_SetsAudience()
    {
        var jwt = Parse(_sut.GenerateAccessToken(CreateUser()));

        jwt.Audiences.Should().ContainSingle().Which.Should().Be(Audience);
    }

    [Fact]
    public void GenerateAccessToken_ExpiresInOneHour()
    {
        var before = DateTime.UtcNow;

        var jwt = Parse(_sut.GenerateAccessToken(CreateUser()));

        jwt.ValidTo.Should().BeCloseTo(before.AddHours(1), TimeSpan.FromSeconds(5));
    }

    private static JsonWebToken Parse(string token) => new(token);

    private static AuthUser CreateUser() => new()
    {
        Id = Guid.NewGuid().ToString(),
        Email = "user@example.com",
        UserName = "user@example.com",
        DisplayName = "Test User",
    };
}
