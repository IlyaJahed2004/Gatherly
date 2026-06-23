using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class GatherlyDbContext(DbContextOptions<GatherlyDbContext> options)
    : IdentityDbContext<User>(options)
{
    public required DbSet<Domain.Event> Events { get; set; }
    public required DbSet<EventAttendee> EventAttendees { get; set; }
    public required DbSet<UserFollowing> UserFollowings { get; set; }

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

        modelBuilder.Entity<UserFollowing>(b =>
        {
            b.HasKey(uf => new { uf.ObserverId, uf.TargetId });

            b.HasOne(uf => uf.Observer)
             .WithMany(u => u.Followings)
             .HasForeignKey(uf => uf.ObserverId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(uf => uf.Target)
             .WithMany(u => u.Followers)
             .HasForeignKey(uf => uf.TargetId)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}