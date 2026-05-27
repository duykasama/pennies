using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.ResendConfirmation;

namespace Pennies.Auth.Tests.Auth.Commands;

public class ResendConfirmationValidatorTests
{
    private readonly ResendConfirmationValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(new ResendConfirmationCommand("user@example.com", "https://myapp.com/verify"));
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    public void Validate_InvalidEmail_Fails(string email)
    {
        var result = _sut.Validate(new ResendConfirmationCommand(email, "https://myapp.com/verify"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ResendConfirmationCommand.Email));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_EmptyConfirmationBaseUrl_Fails(string url)
    {
        var result = _sut.Validate(new ResendConfirmationCommand("user@example.com", url));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ResendConfirmationCommand.ConfirmationBaseUrl));
    }
}
