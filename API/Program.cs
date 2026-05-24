using Application.Core;
using Application.Events.Commands;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register the GatherlyDbContext with the Dependency Injection (DI) container.
// This tells .NET how to construct our database context whenever it's needed:
// 1. Motor: Use the SQLite provider.
// 2. Configuration: Retrieve the Connection String from 'appsettings.json'.
// 3. Lifecycle: Managed as a 'Scoped' service (created/destroyed per request).

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GatherlyDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 2. MEDIATR REGISTRATION (CQRS PIPELINE)
// Scans the specified assembly (where 'GetEventList' is defined) to automatically discover
// and register all IRequestHandler implementations into the Dependency Injection container.
// This enables the message-driven pattern, allowing the controller to dispatch requests
// to their corresponding handlers without explicit instantiation.
builder.Services.AddMediatR(x => x.RegisterServicesFromAssemblyContaining<CreateEvent.Handler>());
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

// --- DATABASE INITIALIZATION & SEEDING PHASE ---

// 1. Create a manual 'Scope' (a temporary memory bubble).
// Think of this as a "temporary contract": we need the DbContext (the waiter) to
// prepare the restaurant before the first customer (web request) arrives.
// Using 'using' ensures this scope and its services are destroyed immediately after use to free up RAM.
using var scope = app.Services.CreateScope();

// 2. Access the Service Provider for this manual scope to "ask" for our registered tools.
var services = scope.ServiceProvider;

try
{
    // 3. Retrieve the GatherlyDbContext instance.
    // .NET follows our blueprint: it builds the Options (SQLite) and injects them into the Constructor.
    var context = services.GetRequiredService<GatherlyDbContext>();

    // 4. Infrastructure Check: Apply any pending migrations.
    // This ensures the SQLite file and tables are ready before the app starts running.
    await context.Database.MigrateAsync();

    // 5. Data Seeding: Fill the database if it's empty.
    // Our 'if(!context.Activities.Any())' guard inside SeedData prevents duplicate data.
    await DbInitializer.SeedData(context);
}
catch (Exception ex)
{
    // 6. Logging: If the "temporary bubble" fails (e.g., DB is locked), log the details.
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during the manual startup scope.");
}

app.Run();
