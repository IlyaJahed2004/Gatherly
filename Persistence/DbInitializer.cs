using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence;

public class DbInitializer
{
    public static async Task SeedData(GatherlyDbContext context, UserManager<User> userManager)
    {
        if (!userManager.Users.Any())
        {
            var users = new List<User>
            {
                new User { DisplayName = "Bob",  UserName = "bob@test.com",  Email = "bob@test.com"  },
                new User { DisplayName = "Tom",  UserName = "tom@test.com",  Email = "tom@test.com"  },
                new User { DisplayName = "Jane", UserName = "jane@test.com", Email = "jane@test.com" },
            };

            foreach (var user in users)
                await userManager.CreateAsync(user, "Pa$$w0rd");
        }

        if (context.Events.Any()) return;

        var bob  = await userManager.FindByEmailAsync("bob@test.com");
        var tom  = await userManager.FindByEmailAsync("tom@test.com");
        var jane = await userManager.FindByEmailAsync("jane@test.com");

        var utcNow = DateTime.UtcNow;

        var events = new List<Event>
        {
            new Event
            {
                Title = "Future of AI Conference 2026",
                StartDate = utcNow.AddMonths(-3), EndDate = utcNow.AddMonths(-3).AddDays(2),
                Description = "Exploring the latest trends in Artificial Intelligence and Machine Learning.",
                Category = "Technology", City = "London", Venue = "ExCeL London",
                Latitude = 51.5074, Longitude = -0.1278, isCancelled = false,
                Attendees = new List<EventAttendee>
                {
                    new EventAttendee { UserId = bob!.Id,  IsHost = true  },
                    new EventAttendee { UserId = tom!.Id,  IsHost = false },
                }
            },
            new Event
            {
                Title = "Summer Jazz Festival",
                StartDate = utcNow.AddMonths(-1), EndDate = utcNow.AddMonths(-1).AddHours(5),
                Description = "Live jazz performances featuring world-class musicians.",
                Category = "Music", City = "Paris", Venue = "Luxembourg Gardens",
                Latitude = 48.8462, Longitude = 2.3372, isCancelled = false,
                Attendees = new List<EventAttendee>
                {
                    new EventAttendee { UserId = jane!.Id, IsHost = true  },
                    new EventAttendee { UserId = bob!.Id,  IsHost = false },
                }
            },

            // --- آینده نزدیک ---
            new Event
            {
                Title = "Charity Marathon",
                StartDate = utcNow.AddMonths(1), EndDate = utcNow.AddMonths(1).AddHours(6),
                Description = "Running to support local children's hospitals.",
                Category = "Sports", City = "Berlin", Venue = "Tiergarten",
                Latitude = 52.5145, Longitude = 13.3501, isCancelled = false,
                Attendees = new List<EventAttendee>
                {
                    new EventAttendee { UserId = tom!.Id,  IsHost = true  },
                    new EventAttendee { UserId = jane!.Id, IsHost = false },
                }
            },
            new Event
            {
                Title = "Modern Art Exhibition",
                StartDate = utcNow.AddMonths(2), EndDate = utcNow.AddMonths(2).AddDays(7),
                Description = "Showcasing works from upcoming minimalist artists.",
                Category = "Art", City = "New York", Venue = "MoMA",
                Latitude = 40.7614, Longitude = -73.9776, isCancelled = false,
                Attendees = new List<EventAttendee>
                {
                    new EventAttendee { UserId = jane!.Id, IsHost = true  },
                    new EventAttendee { UserId = bob!.Id,  IsHost = false },
                }
            },
            new Event
            {
                Title = "Startup Weekend: Product Sprint",
                StartDate = utcNow.AddMonths(3), EndDate = utcNow.AddMonths(3).AddDays(3),
                Description = "Intensive workshop for budding entrepreneurs to build and launch products.",
                Category = "Business", City = "San Francisco", Venue = "Tech Hub",
                Latitude = 37.7749, Longitude = -122.4194, isCancelled = false,
                Attendees = new List<EventAttendee>
                {
                    new EventAttendee { UserId = bob!.Id,  IsHost = true  },
                    new EventAttendee { UserId = tom!.Id,  IsHost = false },
                    new EventAttendee { UserId = jane!.Id, IsHost = false },
                }
            },
            new Event
            {
                Title = "World Food Expo",
                StartDate = utcNow.AddMonths(4), EndDate = utcNow.AddMonths(4).AddDays(2),
                Description = "Tasting cuisines from over 50 countries around the world.",
                Category = "Food", City = "Tokyo", Venue = "Tokyo Big Sight",
                Latitude = 35.6300, Longitude = 139.7950, isCancelled = false,
                Attendees = new List<EventAttendee>
                {
                    new EventAttendee { UserId = tom!.Id,  IsHost = true  },
                    new EventAttendee { UserId = bob!.Id,  IsHost = false },
                }
            },
            new Event
            {
                Title = "Chinese Festivals",
                StartDate = utcNow.AddMonths(1).AddDays(15), EndDate = utcNow.AddMonths(1).AddDays(16),
                Description = "Join us as we celebrate the spirit of Chinese culture with vibrant lanterns, dragon dances, and festive traditions.",
                Category = "Leisure", City = "Seattle", Venue = "Cascade National Park",
                Latitude = 48.7196, Longitude = -121.1855, isCancelled = false,
                Attendees = new List<EventAttendee>
                {
                    new EventAttendee { UserId = jane!.Id, IsHost = true  },
                    new EventAttendee { UserId = tom!.Id,  IsHost = false },
                }
            },
            new Event
            {
                Title = "Nature Reset Retreat",
                StartDate = utcNow.AddMonths(2).AddDays(10), EndDate = utcNow.AddMonths(2).AddDays(13),
                Description = "Take a break from your daily routine and reconnect with nature. Relax in a peaceful forest setting.",
                Category = "Leisure", City = "Washington", Venue = "North Cascades Highway",
                Latitude = 48.5541, Longitude = -120.6558, isCancelled = false,
                Attendees = new List<EventAttendee>
                {
                    new EventAttendee { UserId = bob!.Id,  IsHost = true  },
                    new EventAttendee { UserId = jane!.Id, IsHost = false },
                }
            },
        };

        await context.Events.AddRangeAsync(events);
        await context.SaveChangesAsync();
    }
}