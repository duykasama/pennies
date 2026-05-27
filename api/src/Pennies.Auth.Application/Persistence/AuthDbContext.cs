using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pennies.Auth.Application.Entities;

namespace Pennies.Auth.Application.Persistence;

public class AuthDbContext(DbContextOptions<AuthDbContext> options) : IdentityDbContext<AuthUser>(options);
