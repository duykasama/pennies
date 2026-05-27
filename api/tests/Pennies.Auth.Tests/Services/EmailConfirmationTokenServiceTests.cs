using FluentAssertions;
using Microsoft.AspNetCore.DataProtection;
using Pennies.Auth.Api.Services;
using Pennies.Auth.Application.Services;
using System.Security.Cryptography;

namespace Pennies.Auth.Tests.Services;

public class EmailConfirmationTokenServiceTests
{
    private readonly EmailConfirmationTokenService _sut;

    public EmailConfirmationTokenServiceTests()
    {
        _sut = new EmailConfirmationTokenService(new EphemeralDataProtectionProvider());
    }

    [Fact]
    public void Unprotect_RoundTrips_UserId()
    {
        var userId = Guid.NewGuid().ToString();
        var token = _sut.Protect(userId, "some-identity-token");

        var (extractedUserId, _) = _sut.Unprotect(token);

        extractedUserId.Should().Be(userId);
    }

    [Fact]
    public void Unprotect_RoundTrips_IdentityToken()
    {
        var identityToken = "CfDJ8NaIit5_W4hXoJmfGpYs8Be-Qk9pGKZWymm0jf4QElHXvNsE";
        var token = _sut.Protect(Guid.NewGuid().ToString(), identityToken);

        var (_, extractedToken) = _sut.Unprotect(token);

        extractedToken.Should().Be(identityToken);
    }

    [Fact]
    public void Protect_DifferentInputs_ProduceDifferentTokens()
    {
        var token1 = _sut.Protect(Guid.NewGuid().ToString(), "token-a");
        var token2 = _sut.Protect(Guid.NewGuid().ToString(), "token-b");

        token1.Should().NotBe(token2);
    }

    [Fact]
    public void Unprotect_TamperedToken_ThrowsCryptographicException()
    {
        var act = () => _sut.Unprotect("this-is-not-a-valid-protected-token");

        act.Should().Throw<CryptographicException>();
    }

    [Fact]
    public void Unprotect_TokenFromDifferentKey_ThrowsCryptographicException()
    {
        var otherService = new EmailConfirmationTokenService(new EphemeralDataProtectionProvider());
        var token = otherService.Protect("userId", "identity-token");

        var act = () => _sut.Unprotect(token);

        act.Should().Throw<CryptographicException>();
    }
}
