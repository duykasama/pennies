using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.RefreshToken;

namespace Pennies.Auth.Tests.Auth.Commands;

public class RefreshTokenValidatorTests
{
    private readonly RefreshTokenValidator _sut = new();

    [Fact]
    public void Validate_ValidToken_Passes()
    {
        var result = _sut.Validate(new RefreshTokenCommand("some-valid-token"));
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyToken_Fails()
    {
        var result = _sut.Validate(new RefreshTokenCommand(""));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(RefreshTokenCommand.Token));
    }
}
