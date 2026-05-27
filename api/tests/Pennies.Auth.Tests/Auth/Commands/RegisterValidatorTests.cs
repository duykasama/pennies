using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.Register;

namespace Pennies.Auth.Tests.Auth.Commands;

public class RegisterValidatorTests
{
    private readonly RegisterValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(ValidCommand());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyDisplayName_Fails(string displayName)
    {
        var result = _sut.Validate(ValidCommand() with { DisplayName = displayName });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(RegisterCommand.DisplayName));
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    public void Validate_InvalidEmail_Fails(string email)
    {
        var result = _sut.Validate(ValidCommand() with { Email = email });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(RegisterCommand.Email));
    }

    [Theory]
    [InlineData("")]
    [InlineData("short")]
    public void Validate_InvalidPassword_Fails(string password)
    {
        var result = _sut.Validate(ValidCommand() with { Password = password });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(RegisterCommand.Password));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyConfirmationBaseUrl_Fails(string url)
    {
        var result = _sut.Validate(ValidCommand() with { ConfirmationBaseUrl = url });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(RegisterCommand.ConfirmationBaseUrl));
    }

    private static RegisterCommand ValidCommand() => new(
        DisplayName: "Alice",
        Email: "alice@example.com",
        Password: "Password1!",
        ConfirmationBaseUrl: "https://myapp.com/verify");
}
