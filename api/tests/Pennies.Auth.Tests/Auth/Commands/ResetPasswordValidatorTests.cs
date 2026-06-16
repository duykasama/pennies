using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.ResetPassword;

namespace Pennies.Auth.Tests.Auth.Commands;

public class ResetPasswordValidatorTests
{
    private readonly ResetPasswordValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(ValidCommand());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyToken_Fails(string token)
    {
        var result = _sut.Validate(ValidCommand() with { Token = token });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ResetPasswordCommand.Token));
    }

    [Theory]
    [InlineData("")]
    [InlineData("short")]
    public void Validate_InvalidNewPassword_Fails(string password)
    {
        var result = _sut.Validate(ValidCommand() with { NewPassword = password });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ResetPasswordCommand.NewPassword));
    }

    private static ResetPasswordCommand ValidCommand() => new(
        Token: "some-valid-token",
        NewPassword: "NewPass1!");
}
