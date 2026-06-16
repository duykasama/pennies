var builder = DistributedApplication.CreateBuilder(args);

var rabbitUsername = builder.AddParameter("rabbit-username");
var rabbitPassword = builder.AddParameter("rabbit-password", secret: true);

var rabbit = builder.AddRabbitMQ("rabbitmq", rabbitUsername, rabbitPassword)
    .WithManagementPlugin();

var mailpit = builder.AddMailPit("mailpit");

var redis = builder.AddRedis("redis");

var postgresPassword = builder.AddParameter("postgres-password", secret: true);

var postgres = builder.AddPostgres("postgres", password: postgresPassword)
    .WithDataVolume("pennies_data")
    .WithPgAdmin();

var penniesDb = postgres.AddDatabase("pennies");
var penniesAuth = postgres.AddDatabase("pennies-auth");

var expensesMigrations  = builder.AddProject<Projects.Pennies_Expenses_Migrations>("expenses-migrations");
var authMigrations      = builder.AddProject<Projects.Pennies_Auth_Migrations>("auth-migrations");
var worker              = builder.AddProject<Projects.Pennies_Worker>("pennies-worker");
var expensesApi         = builder.AddProject<Projects.Pennies_Expenses_Api>("pennies-expenses-api");
var authApi             = builder.AddProject<Projects.Pennies_Auth_Api>("pennies-auth-api");
var gateway             = builder.AddProject<Projects.Pennies_Gateway>("pennies-gateway");
var web                 = builder.AddViteApp("web", "../../../web");

expensesMigrations
    .WithReference(penniesDb)
    .WithExplicitStart();

authMigrations
    .WithReference(penniesAuth)
    .WithExplicitStart();

expensesApi
    .WithReference(penniesDb)
    .WaitFor(penniesDb)
    .WithReference(redis)
    .WaitFor(redis);

authApi
    .WithReference(penniesAuth)
    .WaitFor(penniesAuth)
    .WithReference(rabbit);

gateway
    .WithReference(expensesApi)
    .WaitFor(expensesApi)
    .WithReference(authApi)
    .WaitFor(authApi);

worker
    .WithReference(rabbit)
    .WaitFor(rabbit)
    .WithReference(mailpit)
    .WaitFor(mailpit);

web
    .WithReference(gateway)
    .WithEnvironment("API_URL", gateway.GetEndpoint("http"))
    .WithEnvironment("APP_URL", web.GetEndpoint("http"))
    .WithExternalHttpEndpoints()
    .WithHttpEndpoint(port: 3000)
    .WithBun();

builder.Build().Run();
