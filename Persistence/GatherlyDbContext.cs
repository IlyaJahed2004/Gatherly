using System;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

/// <summary>
/// This class acts as the bridge between our C# code and the SQLite database.
/// It uses Dependency Injection (DI) to receive configuration settings from the API project.
/// </summary>
public class GatherlyDbContext(DbContextOptions<GatherlyDbContext> options) : DbContext(options)
{
    /*
       SQLITE DEVELOPMENT NOTES:
       - The 'options' parameter is provided via Program.cs in the API project.
       - SQLite is used for local development, storing data in a local '.db' file.
       - By using DI, this layer remains decoupled from specific connection strings.
    */

    // This property represents the 'Events' table in our database.
    // It maps our Domain Entity (Event) to the Database Table.
    public required DbSet<Domain.Event> Events { get; set; }
}
