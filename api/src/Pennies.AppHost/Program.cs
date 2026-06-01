var builder = DistributedApplication.CreateBuilder(args);

var rabbit = builder.AddRabbitMQ("rabbitmq")
    .WithManagementPlugin();

var mailpit = builder.AddMailPit("mailpit");

var postgresPassword = builder.AddParameter("postgres-password", secret: true);

var postgres = builder.AddPostgres("postgres", password: postgresPassword)
    .WithDataVolume("pennies_data")
    .WithPgAdmin();

var penniesDb = postgres.AddDatabase("pennies");
var penniesAuth = postgres.AddDatabase("pennies-auth");

var coreMigrations  = builder.AddProject<Projects.Pennies_Core_Migrations>("core-migrations");
var authMigrations  = builder.AddProject<Projects.Pennies_Auth_Migrations>("auth-migrations");
var worker          = builder.AddProject<Projects.Pennies_Worker>("pennies-worker");
var coreApi         = builder.AddProject<Projects.Pennies_Core_Api>("pennies-core-api");
var authApi         = builder.AddProject<Projects.Pennies_Auth_Api>("pennies-auth-api");
var web             = builder.AddViteApp("web", "../../../web");

coreMigrations
    .WithReference(penniesDb)
    .WithExplicitStart();

authMigrations
    .WithReference(penniesAuth)
    .WithExplicitStart();

coreApi
    .WithReference(penniesDb)
    .WaitFor(penniesDb);

authApi
    .WithReference(penniesAuth)
    .WaitFor(penniesAuth)
    .WithReference(rabbit);

worker
    .WithReference(rabbit)
    .WaitFor(rabbit)
    .WithReference(mailpit)
    .WaitFor(mailpit);

web
    .WithReference(coreApi)
    .WithEnvironment("API_URL_CORE", coreApi.GetEndpoint("https"))
    .WithReference(authApi)
    .WithEnvironment("API_URL_AUTH", authApi.GetEndpoint("https"))
    .WithEnvironment("APP_URL", web.GetEndpoint("http"))
    .WithExternalHttpEndpoints()
    .WithHttpEndpoint(port: 3000)
    .WithBun();

builder.Build().Run();
