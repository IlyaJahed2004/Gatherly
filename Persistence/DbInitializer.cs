using System;

namespace Persistence;

public class DbInitializer
{
    public static async Task SeedData(GatherlyDbContext context)
    {
        // 1. Check if the database already contains any events.
        // If it's not empty, we skip the seeding process to prevent duplicate data.
        if (context.Events.Any())
            return;

        // 2. Create a list of sample events (Seed Data).
        // These will be used to populate the UI in our React application.
        var events = new List<Domain.Event>
        {
            new Domain.Event
            {
                Title = "Past Event 1",
                Date = DateTime.Now.AddMonths(-2),
                Description = "Event 2 months ago",
                Category = "drinks",
                City = "London",
                Venue = "Pub",
                Latitude = 51.5074,
                Longitude = -0.1278,
            },
            new Domain.Event
            {
                Title = "Past Event 2",
                Date = DateTime.Now.AddMonths(-1),
                Description = "Event 1 month ago",
                Category = "culture",
                City = "Paris",
                Venue = "Louvre",
                Latitude = 48.8566,
                Longitude = 2.3522,
            },
            new Domain.Event
            {
                Title = "Future Event 1",
                Date = DateTime.Now.AddMonths(1),
                Description = "Event in 1 month",
                Category = "music",
                City = "New York",
                Venue = "Madison Square Garden",
                Latitude = 40.7128,
                Longitude = -74.0060,
            },
            new Domain.Event
            {
                Title = "Future Event 2",
                Date = DateTime.Now.AddMonths(2),
                Description = "Event in 2 months",
                Category = "food",
                City = "Rome",
                Venue = "Trattoria da Enzo",
                Latitude = 41.9028,
                Longitude = 12.4964,
            },
            new Domain.Event
            {
                Title = "Future Event 3",
                Date = DateTime.Now.AddMonths(3),
                Description = "Event in 3 months",
                Category = "travel",
                City = "Tokyo",
                Venue = "Shibuya Crossing",
                Latitude = 35.6895,
                Longitude = 139.6917,
            },
            new Domain.Event
            {
                Title = "Future Event 4",
                Date = DateTime.Now.AddMonths(4),
                Description = "Event in 4 months",
                Category = "sports",
                City = "Barcelona",
                Venue = "Camp Nou",
                Latitude = 41.3809,
                Longitude = 2.1228,
            },
            new Domain.Event
            {
                Title = "Future Event 5",
                Date = DateTime.Now.AddMonths(5),
                Description = "Event in 5 months",
                Category = "theatre",
                City = "London",
                Venue = "West End",
                Latitude = 51.5074,
                Longitude = -0.1278,
            },
            new Domain.Event
            {
                Title = "Future Event 6",
                Date = DateTime.Now.AddMonths(6),
                Description = "Event in 6 months",
                Category = "comedy",
                City = "Chicago",
                Venue = "Second City",
                Latitude = 41.8781,
                Longitude = -87.6298,
            },
            new Domain.Event
            {
                Title = "Future Event 7",
                Date = DateTime.Now.AddMonths(7),
                Description = "Event in 7 months",
                Category = "art",
                City = "Amsterdam",
                Venue = "Rijksmuseum",
                Latitude = 52.3676,
                Longitude = 4.9041,
            },
        };

        // 3. Add the entire list to the database context tracked by EF Core.
        await context.Events.AddRangeAsync(events);

        // 4. Push the changes to the physical SQLite database file.
        await context.SaveChangesAsync();
    }
}
