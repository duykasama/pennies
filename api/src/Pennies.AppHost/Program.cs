var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    //.WithDataVolume("pennies_data")
    .WithPgAdmin();

var penniesDb   = postgres.AddDatabase("pennies");
var penniesAuth = postgres.AddDatabase("pennies-auth");

builder.AddProject<Projects.Pennies_Api_Migrations>("api-migrations")
    .WithReference(penniesDb)
    .WithExplicitStart();

builder.AddProject<Projects.Pennies_Auth_Migrations>("auth-migrations")
    .WithReference(penniesAuth)
    .WithExplicitStart();

var coreApi = builder.AddProject<Projects.Pennies_Api>("pennies-api")
    .WithReference(penniesDb)
    .WaitFor(penniesDb);

var authApi = builder.AddProject<Projects.Pennies_Auth>("auth")
    .WithReference(penniesAuth)
    .WaitFor(penniesAuth);

builder.AddViteApp("web", "../../../web")
    .WithBun()
    .WithReference(coreApi)
    .WithEnvironment("API_URL_CORE", coreApi.GetEndpoint("https"))
    .WithReference(authApi)
    .WithEnvironment("API_URL_AUTH", authApi.GetEndpoint("https"))
    .WithExternalHttpEndpoints();

builder.Build().Run();
