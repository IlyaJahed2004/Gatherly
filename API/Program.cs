using API.Middleware;
using Application.Core;
using Application.Events.Commands;
using Application.Events.Validators;
using Application.Interfaces;
using Domain;
using FluentValidation;
using Infrastructure.Photos;
using Infrastructure.Security;
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
// 1. Motor: Use the SQL Server provider.
// 2. Configuration: Retrieve the Connection String from 'appsettings.json'.
// 3. Lifecycle: Managed as a 'Scoped' service (created/destroyed per request).

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GatherlyDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
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

builder.Services.AddScoped<IUserAccessor, UserAccessor>();
builder.Services.AddScoped<IPhotoService, PhotoService>();

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

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy(
        "IsEventHost",
        policy =>
        {
            policy.Requirements.Add(new IsHostRequirment());
        }
    );
});

builder.Services.AddTransient<IAuthorizationHandler, IsHostRequirmentHandler>();

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

// Liara (and most container platforms) inject the port via PORT env var.
// Fallback to 8080 for local Docker testing if PORT isn't set.
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://*:{port}");

var app = builder.Build();

// Configure the HTTP request pipeline.

// MUST be registered FIRST — before all other middleware.
// Middleware runs in registration order. ExceptionMiddleware wraps
// everything below it in a try/catch. If registered later, exceptions
// thrown in earlier middleware would never be caught.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(x =>
    x.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:5173", "https://localhost:5173")
);

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- STATIC FILES (React build output) ---
// UseDefaultFiles must come BEFORE UseStaticFiles: it looks for index.html
// in wwwroot and rewrites the request to it, then UseStaticFiles actually
// serves that file (and any other static assets: JS, CSS, images).
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.MapGroup("api").MapIdentityApi<User>(); //api/login

// Fallback route: any request that didn't match an API controller or a
// real static file (e.g. a client-side React Router path like /events/5)
// gets served index.html instead of a 404, so React Router can take over
// and render the correct page on the client side.
// This MUST be registered after MapControllers so API routes are matched first.
app.MapFallbackToFile("index.html");

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