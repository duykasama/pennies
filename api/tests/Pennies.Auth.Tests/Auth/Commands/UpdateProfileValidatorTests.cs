using FluentAssertions;
using Pennies.Auth.Application.Auth.Commands.ConfirmEmailUpdate;
using Pennies.Auth.Application.Auth.Commands.RequestEmailUpdate;
using Pennies.Auth.Application.Auth.Commands.UpdateDisplayName;

namespace Pennies.Auth.Tests.Auth.Commands;

public class UpdateDisplayNameValidatorTests
{
    private readonly UpdateDisplayNameValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(new UpdateDisplayNameCommand("user-id", "New Name"));
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_WhitespaceDisplayName_Fails(string displayName)
    {
        var result = _sut.Validate(new UpdateDisplayNameCommand("user-id", displayName));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateDisplayNameCommand.DisplayName));
    }

    [Fact]
    public void Validate_EmptyUserId_Fails()
    {
        var result = _sut.Validate(new UpdateDisplayNameCommand("", "New Name"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateDisplayNameCommand.UserId));
    }
}

public class RequestEmailUpdateValidatorTests
{
    private readonly RequestEmailUpdateValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(new RequestEmailUpdateCommand("user-id", "new@example.com"));
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("")]
    public void Validate_InvalidEmail_Fails(string email)
    {
        var result = _sut.Validate(new RequestEmailUpdateCommand("user-id", email));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(RequestEmailUpdateCommand.NewEmail));
    }

    [Fact]
    public void Validate_EmptyUserId_Fails()
    {
        var result = _sut.Validate(new RequestEmailUpdateCommand("", "new@example.com"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(RequestEmailUpdateCommand.UserId));
    }
}

public class ConfirmEmailUpdateValidatorTests
{
    private readonly ConfirmEmailUpdateValidator _sut = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _sut.Validate(new ConfirmEmailUpdateCommand("user-id", "123456"));
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyCode_Fails()
    {
        var result = _sut.Validate(new ConfirmEmailUpdateCommand("user-id", ""));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ConfirmEmailUpdateCommand.Code));
    }

    [Fact]
    public void Validate_EmptyUserId_Fails()
    {
        var result = _sut.Validate(new ConfirmEmailUpdateCommand("", "123456"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(ConfirmEmailUpdateCommand.UserId));
    }
}
