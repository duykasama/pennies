using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.ForgotPassword;

namespace Pennies.Auth.Tests.Auth.Commands;

public class ForgotPasswordValidatorTests
{
    private readonly ForgotPasswordValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(ValidCommand());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    public void Validate_InvalidEmail_Fails(string email)
    {
        var result = _sut.Validate(ValidCommand() with { Email = email });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ForgotPasswordCommand.Email));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyResetBaseUrl_Fails(string url)
    {
        var result = _sut.Validate(ValidCommand() with { ResetBaseUrl = url });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ForgotPasswordCommand.ResetBaseUrl));
    }

    private static ForgotPasswordCommand ValidCommand() => new(
        Email: "alice@example.com",
        ResetBaseUrl: "https://myapp.com/reset-password");
}
