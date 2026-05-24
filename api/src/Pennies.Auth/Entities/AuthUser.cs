using Microsoft.AspNetCore.Identity;

namespace Pennies.Auth.Entities;

public class AuthUser : IdentityUser
{
    public string DisplayName { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
