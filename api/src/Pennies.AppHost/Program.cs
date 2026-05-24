var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume()
    .WithPgAdmin();

var penniesDb   = postgres.AddDatabase("pennies");
var penniesAuth = postgres.AddDatabase("pennies-auth");

builder.AddProject<Projects.Pennies_Api_Migrations>("api-migrations")
    .WithReference(penniesDb)
    .WithExplicitStart();

builder.AddProject<Projects.Pennies_Auth_Migrations>("auth-migrations")
    .WithReference(penniesAuth)
    .WithExplicitStart();

builder.AddProject<Projects.Pennies_Api>("pennies-api")
    .WithReference(penniesDb)
    .WaitFor(penniesDb);

builder.AddProject<Projects.Pennies_Auth>("auth")
    .WithReference(penniesAuth)
    .WaitFor(penniesAuth);

builder.Build().Run();
