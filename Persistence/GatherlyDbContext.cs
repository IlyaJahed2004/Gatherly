using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class GatherlyDbContext(DbContextOptions<GatherlyDbContext> options)
    : IdentityDbContext<User>(options)
{
    public required DbSet<Domain.Event> Events { get; set; }
    public required DbSet<EventAttendee> EventAttendees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<EventAttendee>(b =>
        {
            b.HasKey(ea => new { ea.UserId, ea.EventId });

            b.HasOne(ea => ea.User)
             .WithMany(u => u.Events)
             .HasForeignKey(ea => ea.UserId);

            b.HasOne(ea => ea.Event)
             .WithMany(e => e.Attendees)
             .HasForeignKey(ea => ea.EventId);
        });
    }
}