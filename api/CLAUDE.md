# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build entire solution
dotnet build Pennies.slnx

# Run all tests
dotnet test Pennies.slnx

# Run a single test project
dotnet test tests/Pennies.Application.Tests

# Run a specific test by name filter
dotnet test Pennies.slnx --filter "FullyQualifiedName~CreateExpense"

# Run the API (requires PostgreSQL)
dotnet run --project src/Pennies.Api

# EF Core migrations (run from solution root)
dotnet ef migrations add <Name> --project src/Pennies.Infrastructure --startup-project src/Pennies.Api
dotnet ef database update --project src/Pennies.Infrastructure --startup-project src/Pennies.Api
```

## Architecture

This is a Clean Architecture + CQRS solution for a personal finance / expense-tracking API. The dependency rule is strictly inward: nothing in `Domain` or `Application` may reference `Infrastructure` or `Api`.

```
Pennies.Api → Pennies.Application → Pennies.Domain
Pennies.Api → Pennies.Infrastructure → Pennies.Domain
                                     → Pennies.Application
```

### Projects

| Project | Role |
|---|---|
| `Pennies.Domain` | Entities, repository interfaces, `DomainException`. Uses `<FrameworkReference>` for `IdentityUser`. |
| `Pennies.Application` | All CQRS slices (commands, queries, handlers, validators), DTOs, service interfaces, pipeline behaviors. |
| `Pennies.Infrastructure` | `AppDbContext` (extends `IdentityDbContext<AppUser>`), EF configurations, repository implementations, `JwtTokenService`, `EmailService`, `DependencyInjection.cs`. |
| `Pennies.Api` | Minimal API endpoints, `ExceptionHandlingMiddleware`, `ResultExtensions`, `Program.cs`. |

### CQRS pattern

Each feature lives in a self-contained folder under `Application/<Feature>/Commands/<Name>/` or `Application/<Feature>/Queries/<Name>/`. Every folder contains exactly three files: `*Command.cs` / `*Query.cs`, `*Handler.cs`, and `*Validator.cs`.

Commands and queries use `sealed record` and implement `IRequest<Result<T>>`. Handlers return `Result<T>` — never throw for expected failures.

```
Application/Expenses/
  Commands/CreateExpense/  CreateExpenseCommand, CreateExpenseHandler, CreateExpenseValidator
  Commands/DeleteExpense/  ...
  Queries/GetExpenses/     GetExpensesQuery, GetExpensesHandler
  Queries/GetExpenseById/  ...
  DTOs/ExpenseResponse.cs  (+ internal ToResponse() extension on the domain entity)
```

### Key patterns

**`Result<T>` / `Error`** — handlers return `Result<T>.Success(value)` or `Result<T>.Failure(Error.NotFound(...))`. `ResultExtensions.ToHttpResult()` in `Pennies.Api` maps these to the correct HTTP status.

**MediatR pipeline** — `LoggingBehavior` → `ValidationBehavior` → handler. `ValidationBehavior` throws `FluentValidation.ValidationException` on failure; `ExceptionHandlingMiddleware` catches it and returns 422.

**Authentication** — ASP.NET Core Identity (`UserManager<AppUser>`, `SignInManager<AppUser>`) handles user storage and password hashing. `JwtTokenService` issues JWTs independently; the API uses JWT Bearer auth only (no Identity cookies).

**Mapping** — no AutoMapper. Each DTO file contains an `internal static` extension method (e.g., `expense.ToResponse()`) co-located with the DTO.

**DI registration** — Infrastructure registers everything via `builder.Services.AddInfrastructure(configuration)` in `Program.cs`. Application layer registers nothing — its handlers and validators are scanned from `typeof(AssemblyMarker).Assembly`.

### Package management

Packages are managed centrally via `Directory.Packages.props` — version numbers live only there. Add versions there before referencing a new package in any `.csproj`. `Directory.Build.props` provides `TargetFramework`, `Nullable`, and `ImplicitUsings` to all projects.

### Configuration

`appsettings.json` expects:
- `ConnectionStrings:Postgres` — Npgsql connection string
- `Jwt:Issuer`, `Jwt:Audience`, `Jwt:Secret` — JWT settings used by both `JwtTokenService` and the Bearer token validation in `Program.cs`
