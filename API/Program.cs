using API.Middleware;
using Application.Core;
using Application.Events.Commands;
using Application.Events.Validators;
using Domain;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options =>
{
    // Global Authorization Policy: Requires authentication for all endpoints by default.
    // Individual endpoints can override this with [AllowAnonymous] if needed.
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

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

// Scans the assembly containing CreateEventValidator and registers
// ALL validators found there automatically with the DI container.
builder.Services.AddValidatorsFromAssemblyContaining<CreateEventValidator>();

// MediatR registration — scans for all IRequestHandler implementations
// and registers the ValidationBehavior as an open generic pipeline behaviour.
// AddOpenBehavior plugs ValidationBehavior<TRequest, TResponse> into the
// MediatR pipeline so it intercepts every Command and Query automatically —
// no changes needed in individual handlers.
builder.Services.AddMediatR(x =>
{
    x.RegisterServicesFromAssemblyContaining<CreateEvent.Handler>();
    x.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// Register ExceptionMiddleware as a transient service.
// Transient = a new instance is created per request and disposed after.
// Must be registered in DI because it implements IMiddleware —
// ASP.NET Core resolves it from the container when the pipeline runs.
builder.Services.AddTransient<ExceptionMiddleware>();

builder
    .Services.AddIdentityApiEndpoints<User>(opt =>
    {
        //Unique Username is enforced by default
        opt.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<GatherlyDbContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.

// MUST be registered FIRST — before all other middleware.
// Middleware runs in registration order. ExceptionMiddleware wraps
// everything below it in a try/catch. If registered later, exceptions
// thrown in earlier middleware would never be caught.
app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.MapGroup("api").MapIdentityApi<User>(); //api/login

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
    var userManager = services.GetRequiredService<UserManager<User>>();

    // 4. Infrastructure Check: Apply any pending migrations.
    // This ensures the SQLite file and tables are ready before the app starts running.
    await context.Database.MigrateAsync();

    // 5. Data Seeding: Fill the database if it's empty.
    // Our 'if(!context.Activities.Any())' guard inside SeedData prevents duplicate data.
    await DbInitializer.SeedData(context, userManager);
}
catch (Exception ex)
{
    // 6. Logging: If the "temporary bubble" fails (e.g., DB is locked), log the details.
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during the manual startup scope.");
}

app.Run();
