using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.ChangePassword;

namespace Pennies.Auth.Tests.Auth.Commands;

public class ChangePasswordValidatorTests
{
    private readonly ChangePasswordValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(ValidCommand());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyCurrentPassword_Fails(string password)
    {
        var result = _sut.Validate(ValidCommand() with { CurrentPassword = password });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ChangePasswordCommand.CurrentPassword));
    }

    [Theory]
    [InlineData("")]
    [InlineData("short")]
    public void Validate_InvalidNewPassword_Fails(string password)
    {
        var result = _sut.Validate(ValidCommand() with { NewPassword = password });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ChangePasswordCommand.NewPassword));
    }

    private static ChangePasswordCommand ValidCommand() => new(
        UserId: "user-id",
        CurrentPassword: "OldPass1!",
        NewPassword: "NewPass1!");
}
