using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pennies.Auth.Entities;

namespace Pennies.Auth.Persistence;

public class AuthDbContext(DbContextOptions<AuthDbContext> options) : IdentityDbContext<AuthUser>(options);
