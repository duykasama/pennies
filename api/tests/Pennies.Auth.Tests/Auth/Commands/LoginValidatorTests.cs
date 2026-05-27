using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.Login;

namespace Pennies.Auth.Tests.Auth.Commands;

public class LoginValidatorTests
{
    private readonly LoginValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(new LoginCommand("user@example.com", "password123"));
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    public void Validate_InvalidEmail_Fails(string email)
    {
        var result = _sut.Validate(new LoginCommand(email, "password123"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(LoginCommand.Email));
    }

    [Fact]
    public void Validate_EmptyPassword_Fails()
    {
        var result = _sut.Validate(new LoginCommand("user@example.com", ""));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(LoginCommand.Password));
    }
}
