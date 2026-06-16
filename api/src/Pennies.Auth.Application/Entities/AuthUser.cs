using Microsoft.AspNetCore.Identity;

namespace Pennies.Auth.Application.Entities;

public class AuthUser : IdentityUser
{
    public string DisplayName { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public string? PendingEmail { get; set; }
    public string? EmailUpdateCode { get; set; }
    public DateTime? EmailUpdateCodeExpiresAt { get; set; }
}
