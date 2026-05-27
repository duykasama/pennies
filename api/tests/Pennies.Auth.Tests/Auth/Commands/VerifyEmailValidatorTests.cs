using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.VerifyEmail;

namespace Pennies.Auth.Tests.Auth.Commands;

public class VerifyEmailValidatorTests
{
    private readonly VerifyEmailValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(new VerifyEmailCommand("some-opaque-token"));
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyToken_Fails(string token)
    {
        var result = _sut.Validate(new VerifyEmailCommand(token));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(VerifyEmailCommand.Token));
    }
}
