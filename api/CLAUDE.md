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

# Run with Aspire (starts Postgres, migrations, both APIs, and frontend)
dotnet run --project src/Pennies.AppHost

# Run the main API standalone (requires Postgres)
dotnet run --project src/Pennies.Core.Api

# Run the auth service standalone (requires Postgres)
dotnet run --project src/Pennies.Auth.Api

# EF Core migrations for Pennies.Auth.Api (run from solution root)
dotnet ef migrations add <Name> --project src/Pennies.Auth.Api --startup-project src/Pennies.Auth.Migrations
dotnet ef database update --project src/Pennies.Auth.Api --startup-project src/Pennies.Auth.Migrations
```

## Architecture

This is a Clean Architecture + CQRS solution split into two microservices sharing a JWT secret. The dependency rule is strictly inward: nothing in `Domain` or `Application` may reference `Infrastructure` or `Api`.

```
Pennies.Core.Api → Pennies.Application → Pennies.Domain
Pennies.Core.Api → Pennies.Infrastructure → Pennies.Domain
                                     → Pennies.Application
```

### Projects

| Project | Role |
|---|---|
| `Pennies.Domain` | Entities, repository interfaces, `DomainException`, `Entity` base class (Id, CreatedAt, UpdatedAt). |
| `Pennies.Application` | All CQRS slices, DTOs, `Result<T>`/`Error`, pipeline behaviors (LoggingBehavior → ValidationBehavior → handler). |
| `Pennies.Infrastructure` | `AppDbContext`, EF entity configurations, repository implementations, `DependencyInjection.cs`. |
| `Pennies.Core.Api` | Minimal API endpoints, `ExceptionHandlingMiddleware`, `ResultExtensions`, `Program.cs`. |
| `Pennies.Auth.Api` | Separate auth microservice: ASP.NET Identity + EF Core, JWT issuance, email verification endpoints. |
| `Pennies.Core.Migrations` | DbUp console app — SQL script migrations for the core API's Postgres database. |
| `Pennies.Auth.Migrations` | EF Core migrations startup project for the auth database. |
| `Pennies.AppHost` | .NET Aspire orchestrator — starts Postgres, runs both migration projects, then both APIs and the frontend. |
| `Pennies.ServiceDefaults` | Shared Aspire defaults: OpenTelemetry, service discovery, HTTP resilience. |

### CQRS pattern

Each feature lives in `Application/<Feature>/Commands/<Name>/` or `Application/<Feature>/Queries/<Name>/`. Every folder has exactly three files: `*Command.cs` / `*Query.cs`, `*Handler.cs`, and `*Validator.cs`.

Commands and queries are `sealed record` implementing `IRequest<Result<T>>`. Handlers return `Result<T>` — never throw for expected failures.

```
Application/Expenses/
  Commands/CreateExpense/  CreateExpenseCommand, CreateExpenseHandler, CreateExpenseValidator
  Commands/DeleteExpense/  ...
  Queries/GetExpenses/     GetExpensesQuery, GetExpensesHandler, GetExpensesValidator
  Queries/GetExpenseById/  ...
  DTOs/ExpenseResponse.cs  (+ internal ToResponse() extension on the domain entity)
```

### Key patterns

**`Result<T>` / `Error`** — handlers return `Result<T>.Success(value)` or `Result<T>.Failure(Error.NotFound(...))`. `ResultExtensions.ToHttpResult()` in `Pennies.Core.Api` maps these to the correct HTTP status.

**MediatR pipeline** — `LoggingBehavior` → `ValidationBehavior` → handler. `ValidationBehavior` throws `FluentValidation.ValidationException` on failure; `ExceptionHandlingMiddleware` catches it and returns 422.

**Authentication flow** — `Pennies.Auth.Api` handles registration, email verification, and login, issuing JWTs (Subject = UserId, 1-hour expiry). `Pennies.Core.Api` validates those JWTs via Bearer auth; the UserId is extracted from the Subject claim in each endpoint. Both services share the same `Jwt:Issuer`, `Jwt:Audience`, and `Jwt:Secret`.

**Migrations** — Two strategies in use: `Pennies.Core.Api` uses DbUp (plain SQL scripts in `Pennies.Core.Migrations/Scripts/`); `Pennies.Auth.Api` uses EF Core code-first migrations with `Pennies.Auth.Migrations` as the startup project. Aspire runs both migration projects before starting the APIs.

**Mapping** — No AutoMapper. Each DTO file has an `internal static` extension method (e.g., `expense.ToResponse()`) co-located with the DTO.

**DI registration** — Infrastructure registers via `builder.Services.AddInfrastructure(configuration)` in `Program.cs`. Application handlers and validators are scanned from `typeof(AssemblyMarker).Assembly`.

### Testing

Tests use xUnit, NSubstitute (mocks), and FluentAssertions. Test projects mirror the source project they cover:

```
tests/
  Pennies.Domain.Tests/
  Pennies.Application.Tests/
  Pennies.Auth.Tests/
```

### Package management

Packages are managed centrally via `Directory.Packages.props` — version numbers live only there. Add a version entry there before referencing a new package in any `.csproj`. `Directory.Build.props` provides `TargetFramework` (net10.0), `Nullable`, and `ImplicitUsings` to all projects.

### Configuration

`Pennies.Core.Api/appsettings.json`:
- `ConnectionStrings:pennies` — Npgsql connection string for the main database
- `Jwt:Issuer`, `Jwt:Audience`, `Jwt:Secret`

`Pennies.Auth.Api/appsettings.json`:
- `ConnectionStrings:pennies-auth` — Npgsql connection string for the auth database
- `Jwt:Issuer`, `Jwt:Audience`, `Jwt:Secret` — must match the main API's values
