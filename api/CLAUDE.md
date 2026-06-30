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

# Run with Aspire (starts Postgres, Redis, RabbitMQ, Mailpit, migrations, both APIs, Gateway, Worker, and frontend)
dotnet run --project src/Pennies.AppHost

# Run the expenses API standalone (requires Postgres + Redis)
dotnet run --project src/Pennies.Expenses.Api

# Run the auth service standalone (requires Postgres)
dotnet run --project src/Pennies.Auth.Api

# EF Core migrations for Pennies.Auth.Api (run from solution root)
dotnet ef migrations add <Name> --project src/Pennies.Auth.Api --startup-project src/Pennies.Auth.Migrations
dotnet ef database update --project src/Pennies.Auth.Api --startup-project src/Pennies.Auth.Migrations
```

## Architecture

This is a Clean Architecture + CQRS solution with multiple microservices. The dependency rule is strictly inward: nothing in `Domain` or `Application` may reference `Infrastructure` or `Api`.

```
Pennies.Gateway      → Pennies.Expenses.Api → Pennies.Application → Pennies.Domain
                                            → Pennies.Infrastructure
                     → Pennies.Auth.Api     → Pennies.Auth.Application
Pennies.Worker       → Pennies.Messaging (contracts)
Pennies.Messaging.RabbitMQ → Pennies.Messaging
```

### Projects

| Project | Role |
|---|---|
| `Pennies.Domain` | Entities, repository interfaces, `DomainException`, `Entity` base class (Id, CreatedAt, UpdatedAt). |
| `Pennies.Application` | All CQRS slices, DTOs, `Result<T>`/`Error`, pipeline behaviors (LoggingBehavior → CachingBehavior → ValidationBehavior → handler), caching interfaces. |
| `Pennies.Auth.Application` | CQRS slices, DTOs, and pipeline behaviors (LoggingBehavior → ValidationBehavior) for the auth microservice — no caching. |
| `Pennies.Infrastructure` | `AppDbContext`, EF entity configurations, repository implementations, Redis cache (`ICacheInvalidator`), `DependencyInjection.cs`. |
| `Pennies.Expenses.Api` | Minimal API endpoints, `ExceptionHandlingMiddleware`, `ResultExtensions`, `Program.cs`. |
| `Pennies.Auth.Api` | Separate auth microservice: ASP.NET Identity + EF Core, JWT issuance, email verification endpoints, `TokenBlacklistService` (Redis-backed). |
| `Pennies.Gateway` | Ocelot API gateway — routes all client traffic to `Pennies.Expenses.Api` and `Pennies.Auth.Api`. |
| `Pennies.Messaging` | Abstract event contracts (`ExpenseCreatedEvent`, email events) and `IMessagePublisher` interface. |
| `Pennies.Messaging.RabbitMQ` | MassTransit `MassTransitMessagePublisher`; configures RabbitMQ transport via `AddMessaging()`. |
| `Pennies.Worker` | Background worker — MassTransit consumers for email events (SMTP via MailKit/Mailpit), 5-retry exponential backoff. |
| `Pennies.Expenses.Migrations` | DbUp console app — SQL script migrations for the expenses Postgres database. |
| `Pennies.Auth.Migrations` | EF Core migrations startup project for the auth database. |
| `Pennies.AppHost` | .NET Aspire orchestrator — starts Postgres, Redis, RabbitMQ, Mailpit, both migration projects, both APIs, Gateway, Worker, and frontend. |
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

**`Result<T>` / `Error`** — handlers return `Result<T>.Success(value)` or `Result<T>.Failure(Error.NotFound(...))`. `ResultExtensions.ToHttpResult()` in `Pennies.Expenses.Api` maps these to the correct HTTP status.

**MediatR pipeline** — `Pennies.Expenses.Api`: `LoggingBehavior` → `CachingBehavior` → `ValidationBehavior` → handler. `Pennies.Auth.Api`: `LoggingBehavior` → `ValidationBehavior` → handler (no caching). `ValidationBehavior` throws `FluentValidation.ValidationException` on failure; `ExceptionHandlingMiddleware` catches it and returns 422.

**Caching** — Queries opt in by implementing `ICacheableQuery` (`Application/Common/Caching/`) with a `CacheKey` string and optional `Expiration`. `CachingBehavior` checks Redis on each request and stores the result on a miss. Commands invalidate via `ICacheInvalidator` using glob patterns (e.g. `expenses:{userId}:list:*`). Redis is wired up with `AddCaching()` in `Pennies.Infrastructure/DependencyInjection.cs`.

**Messaging** — Publish domain events by injecting `IMessagePublisher` (from `Pennies.Messaging`) into a handler and calling `PublishAsync(new SomeEvent(...))`. Event contracts live in `Pennies.Messaging/Contracts/`. `Pennies.Worker` contains the consumers; `Pennies.Auth.Api` and `Pennies.Expenses.Api` reference `Pennies.Messaging.RabbitMQ` and call `builder.AddMessaging()`.

**Authentication flow** — Clients talk to `Pennies.Gateway` (Ocelot). The Gateway proxies auth requests to `Pennies.Auth.Api` (registration, login, email verification, JWT issuance) and resource requests to `Pennies.Expenses.Api`. `Pennies.Auth.Api` validates tokens against a Redis-backed `TokenBlacklistService` (JTI claim). Both services share the same `Jwt:Issuer`, `Jwt:Audience`, and `Jwt:Secret`.

**Migrations** — Two strategies: `Pennies.Expenses.Api` uses DbUp (plain SQL scripts in `Pennies.Expenses.Migrations/Scripts/`); `Pennies.Auth.Api` uses EF Core code-first migrations with `Pennies.Auth.Migrations` as the startup project. Aspire starts both migration projects (with `WithExplicitStart()`) before the APIs.

**Mapping** — No AutoMapper. Each DTO file has an `internal static` extension method (e.g., `expense.ToResponse()`) co-located with the DTO.

**DI registration** — Infrastructure registers via `builder.Services.AddInfrastructure(configuration)` and caching via `builder.AddCaching()` in `Program.cs`. Application handlers and validators are scanned from `typeof(AssemblyMarker).Assembly`.

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

`Pennies.Expenses.Api/appsettings.json`:
- `ConnectionStrings:pennies` — Npgsql connection string for the main database
- `Jwt:Issuer`, `Jwt:Audience`, `Jwt:Secret`
- `CacheSettings:ExpirationMinutes` — Redis cache TTL (default: 5)

`Pennies.Auth.Api/appsettings.json`:
- `ConnectionStrings:pennies-auth` — Npgsql connection string for the auth database
- `Jwt:Issuer`, `Jwt:Audience`, `Jwt:Secret` — must match the expenses API's values

`Pennies.Worker/appsettings.json`:
- `Smtp:Host`, `Smtp:Port`, `Smtp:From`, `Smtp:UseSsl` — SMTP settings (defaults to Mailpit on port 1025)
