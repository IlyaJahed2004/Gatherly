using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

/// <summary>
/// This class acts as the bridge between our C# code and the SQLite database.
/// It uses Dependency Injection (DI) to receive configuration settings from the API project.
/// </summary>
public class GatherlyDbContext(DbContextOptions<GatherlyDbContext> options)
    : IdentityDbContext<User>(options)
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
    public required DbSet<EventAttendee> EventAttendees { get; set; }
    public required DbSet<UserFollowing> UserFollowings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // 1. Composite Primary Key
        builder.Entity<EventAttendee>(x => x.HasKey(a => new { a.EventId, a.UserId }));

        builder
            .Entity<EventAttendee>()
            .HasOne(x => x.User) // EventAttendee has a User property → UserId is FK to AspNetUsers
            .WithMany(x => x.Events) // one User can have many EventAttendee rows
            .HasForeignKey(x => x.UserId); // the FK column is UserId

        // 3. Event → EventAttendee relationship
        builder
            .Entity<EventAttendee>()
            .HasOne(x => x.Event) // EventAttendee has an Event property → EventId is FK to Events
            .WithMany(x => x.Attendees) // one Event can have many EventAttendee rows
            .HasForeignKey(x => x.EventId); // the FK column is EventId

        builder.Entity<UserFollowing>(x =>
        {
            x.HasKey(k => new { k.ObserverId, k.TargetId });

            x.HasOne(o => o.Observer)
                .WithMany(f => f.Followings)
                .HasForeignKey(o => o.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);

            x.HasOne(o => o.Target)
                .WithMany(f => f.Followers)
                .HasForeignKey(o => o.TargetId)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}
