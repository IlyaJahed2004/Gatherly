using Domain;

namespace Persistence;

public class DbInitializer
{
    public static async Task SeedData(GatherlyDbContext context)
    {
        if (context.Events.Any())
            return;

        var utcNow = DateTime.UtcNow;

        var events = new List<Event>
        {
            // Past Events
            new Event
            {
                Title = "Future of AI Conference 2026",
                StartDate = utcNow.AddMonths(-3),
                EndDate = utcNow.AddMonths(-3).AddDays(2),
                Description =
                    "Exploring the latest trends in Artificial Intelligence and Machine Learning.",
                Category = "Technology",
                City = "London",
                Venue = "ExCeL London",
                Latitude = 51.5074,
                Longitude = -0.1278,
                isCancelled = false,
            },
            new Event
            {
                Title = "Summer Jazz Festival",
                StartDate = utcNow.AddMonths(-1),
                EndDate = utcNow.AddMonths(-1).AddHours(5),
                Description = "Live jazz performances featuring world-class musicians.",
                Category = "Music",
                City = "Paris",
                Venue = "Luxembourg Gardens",
                Latitude = 48.8462,
                Longitude = 2.3372,
                isCancelled = false,
            },
            // Current / Near Future Events
            new Event
            {
                Title = "Charity Marathon",
                StartDate = utcNow.AddMonths(1),
                EndDate = utcNow.AddMonths(1).AddHours(6),
                Description = "Running to support local children's hospitals.",
                Category = "Sports",
                City = "Berlin",
                Venue = "Tiergarten",
                Latitude = 52.5145,
                Longitude = 13.3501,
                isCancelled = false,
            },
            new Event
            {
                Title = "Modern Art Exhibition",
                StartDate = utcNow.AddMonths(2),
                EndDate = utcNow.AddMonths(2).AddDays(7),
                Description = "Showcasing works from upcoming minimalist artists.",
                Category = "Art",
                City = "New York",
                Venue = "MoMA",
                Latitude = 40.7614,
                Longitude = -73.9776,
                isCancelled = true, // Example of cancelled event
            },
            // Far Future Events
            new Event
            {
                Title = "Startup Weekend: Product Sprint",
                StartDate = utcNow.AddMonths(4),
                EndDate = utcNow.AddMonths(4).AddDays(3),
                Description = "Intensive workshop for budding entrepreneurs.",
                Category = "Business",
                City = "San Francisco",
                Venue = "Tech Hub",
                Latitude = 37.7749,
                Longitude = -122.4194,
                isCancelled = false,
            },
            new Event
            {
                Title = "World Food Expo",
                StartDate = utcNow.AddMonths(5),
                EndDate = utcNow.AddMonths(5).AddDays(2),
                Description = "Tasting cuisines from over 50 countries.",
                Category = "Food",
                City = "Tokyo",
                Venue = "Tokyo Big Sight",
                Latitude = 35.6300,
                Longitude = 139.7950,
                isCancelled = false,
            },
            new Event
            {
                Title = "Historical Documentary Screening",
                StartDate = utcNow.AddMonths(6),
                EndDate = utcNow.AddMonths(6).AddHours(2),
                Description = "An in-depth look at the Industrial Revolution.",
                Category = "Culture",
                City = "Rome",
                Venue = "Colosseum Area",
                Latitude = 41.8902,
                Longitude = 12.4922,
                isCancelled = false,
            },
            new Event
            {
                Title = "Extreme Sports Championship",
                StartDate = utcNow.AddMonths(7),
                EndDate = utcNow.AddMonths(7).AddDays(4),
                Description = "Skateboarding, BMX, and Parkour showdown.",
                Category = "Sports",
                City = "Barcelona",
                Venue = "Parc del Forum",
                Latitude = 41.4116,
                Longitude = 2.2223,
                isCancelled = false,
            },
        };

        await context.Events.AddRangeAsync(events);
        await context.SaveChangesAsync();
    }
}
