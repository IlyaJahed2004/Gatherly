using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence;

public class DbInitializer
{
    public static async Task SeedData(GatherlyDbContext context, UserManager<User> userManager)
    {
        var users = new List<User>()
        {
            new User()
            {
                Id = "bob_id",
                DisplayName = "Bob",
                UserName = "bob@test.com",
                Email = "bob@test.com",
                PublicId = "UsersPhotos/zwdn94prwxr4nuuau6wi",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783260495/UsersPhotos/jnfucmkcmvjnfynqsoe8.jpg"
            },
            new User()
            {
                Id = "tom_id",
                DisplayName = "Tom",
                UserName = "tom@test.com",
                Email = "tom@test.com",
                PublicId = "UsersPhotos/bb058n5bviaoivyea4bn",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783325607/UsersPhotos/bb058n5bviaoivyea4bn.jpg"
            },
            new User()
            {
                Id = "jane_id",
                DisplayName = "Jane",
                UserName = "jane@test.com",
                Email = "jane@test.com",
                PublicId = "UsersPhotos/ivm5buziyenj24cgzaxm",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783325699/UsersPhotos/ivm5buziyenj24cgzaxm.jpg"
            },
        };

        if (!userManager.Users.Any())
        {
            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd"); //Need strong password(contains number, Uppercase and lowercase letters and Special characters like $). Otherwise your user won't be created and will fail silently.
            }
        }

        if (context.Events.Any())
            return;

        var utcNow = DateTime.UtcNow;

        var events = new List<Event>
        {
            new()
            {
                Title = "Central Park Friendly Soccer Match",
                Description = "A casual 11-a-side friendly game on turf. All skill levels are welcome. Please bring your own cleats and water bottle.",
                StartDate = DateTime.UtcNow.AddDays(7),
                EndDate = DateTime.UtcNow.AddDays(7).AddHours(2),
                Category = "Sports",
                City = "New York",
                Venue = "Central Park North Meadow, Field 4",
                Latitude = 40.7968,
                Longitude = -73.9592,
                PublicId = "UsersPhotos/pzvj4gykezmsorg2nmve",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783326485/UsersPhotos/pzvj4gykezmsorg2nmve.jpg",
                Attendees = [ new() { UserId = users[0].Id, IsHost = true }, new() { UserId = users[1].Id } ]
            },
            new()
            {
                Title = "AI & The Future of Software Architecture",
                Description = "An insightful seminar exploring how LLMs and Generative AI are transforming system design and the daily workflow of modern .NET developers.",
                StartDate = DateTime.UtcNow.AddDays(14),
                EndDate = DateTime.UtcNow.AddDays(14).AddHours(4),
                Category = "Science",
                City = "San Francisco",
                Venue = "The SF Tech Hub - Main Auditorium",
                Latitude = 37.7749,
                Longitude = -122.4194,
                PublicId = "UsersPhotos/n7l1vpclx4iool47igjf",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783326137/UsersPhotos/n7l1vpclx4iool47igjf.jpg",
                Attendees = [ new() { UserId = users[2].Id, IsHost = true }, new() { UserId = users[0].Id } ]
            },
            new()
            {
                Title = "Quantum Computing Workshop for Beginners",
                Description = "Demystifying qubits, superposition, and quantum algorithms. A conceptual introduction designed for software developers without a physics degree.",
                StartDate = DateTime.UtcNow.AddDays(-5),
                EndDate = DateTime.UtcNow.AddDays(-5).AddHours(3),
                Category = "Science",
                City = "Boston",
                Venue = "MIT Building 10 - Seminar Hall",
                Latitude = 42.3601,
                Longitude = -71.0942,
                PublicId = "UsersPhotos/dkcacsnwvyfntv3hdal3",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783327146/UsersPhotos/dkcacsnwvyfntv3hdal3.jpg",
                Attendees = [ new() { UserId = users[1].Id, IsHost = true } ]
            },
            new()
            {
                Title = "Street Photography Walk: Soho & Chinatown",
                Description = "Join us for a friendly photo walk to capture the vibrant streets, neon lights, and historic architecture of Soho. Beginners welcome!",
                StartDate = DateTime.UtcNow.AddMonths(1),
                EndDate = DateTime.UtcNow.AddMonths(1).AddHours(5),
                Category = "Leisure",
                City = "London",
                Venue = "Leicester Square Station Exit",
                Latitude = 51.5113,
                Longitude = -0.1285,
                PublicId = "UsersPhotos/aqtakzypcvgaj7tzzzuc",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783326897/UsersPhotos/aqtakzypcvgaj7tzzzuc.jpg",
                Attendees = [ new() { UserId = users[0].Id, IsHost = true }, new() { UserId = users[2].Id } ]
            },
            new()
            {
                Title = "Clean Architecture Book Club",
                Description = "A weekly study group and open discussion focusing on Uncle Bob's Clean Architecture, covering component principles and boundaries.",
                StartDate = DateTime.UtcNow.AddDays(3),
                EndDate = DateTime.UtcNow.AddDays(3).AddHours(2),
                Category = "Other",
                City = "Seattle",
                Venue = "Seattle Public Library - Meeting Room A",
                Latitude = 47.6062,
                Longitude = -122.3321,
                PublicId = "UsersPhotos/dubivkuk06yr9rwit2gb",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783326337/UsersPhotos/dubivkuk06yr9rwit2gb.jpg",
                Attendees = [ new() { UserId = users[1].Id, IsHost = true } ]
            },
            new()
            {
                Title = "Sunrise Yoga & Mindfulness at Hyde Park",
                Description = "Start your weekend with an outdoor Vinyasa flow. Suitable for all fitness levels. Please bring your own yoga mat.",
                StartDate = DateTime.UtcNow.AddDays(10),
                EndDate = DateTime.UtcNow.AddDays(10).AddHours(1.5),
                Category = "Sports",
                City = "Sydney",
                Venue = "Hyde Park - Archibald Fountain Lawn",
                Latitude = -33.8688,
                Longitude = 151.2093,
                PublicId = "UsersPhotos/lwrqgshln6frus6w8wfe",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783325873/UsersPhotos/lwrqgshln6frus6w8wfe.jpg",
                Attendees = [ new() { UserId = users[2].Id, IsHost = true }, new() { UserId = users[1].Id } ]
            },
            new()
            {
                Title = "Web Security Masterclass: OWASP Top 10",
                Description = "An online workshop focusing on modern web vulnerabilities. Learn how to secure your APIs and mitigate attacks in ASP.NET Core.",
                StartDate = DateTime.UtcNow.AddDays(20),
                EndDate = DateTime.UtcNow.AddDays(20).AddHours(2),
                Category = "Science",
                City = "Online",
                Venue = "Zoom Webinar Link",
                Latitude = 0,
                Longitude = 0,
                PublicId = "UsersPhotos/hgmz0txlxnw1odp0rugw",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783326834/UsersPhotos/hgmz0txlxnw1odp0rugw.webp",
                Attendees = [ new() { UserId = users[0].Id, IsHost = true } ]
            },
            new()
            {
                Title = "Social Board Game & Mafia Night",
                Description = "Meet new people and enjoy classic social deduction games. We will be running Mafia and Secret Hitler tables. Rules will be explained!",
                StartDate = DateTime.UtcNow.AddDays(2),
                EndDate = DateTime.UtcNow.AddDays(2).AddHours(4),
                Category = "Leisure",
                City = "Toronto",
                Venue = "Snakes & Lattes Board Game Cafe - College St.",
                Latitude = 43.6554,
                Longitude = -79.4131,
                PublicId = "UsersPhotos/vnjoa79xva040ppb051y",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783326254/UsersPhotos/vnjoa79xva040ppb051y.jpg",
                Attendees = [ new() { UserId = users[1].Id, IsHost = true }, new() { UserId = users[0].Id }, new() { UserId = users[2].Id } ]
            },
            new()
            {
                Title = "Next-Gen Space Exploration Expo",
                Description = "A major exhibition featuring mockups of next-generation rockets, lunar rovers, and cutting-edge deep space exploration gear.",
                StartDate = DateTime.UtcNow.AddMonths(2),
                EndDate = DateTime.UtcNow.AddMonths(2).AddDays(3),
                Category = "Science",
                City = "Houston",
                Venue = "Space Center Houston - Exhibition Hall 2",
                Latitude = 29.5519,
                Longitude = -95.0984,
                PublicId = "UsersPhotos/xd2oruozq26krkcr083e",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783326042/UsersPhotos/xd2oruozq26krkcr083e.jpg",
                Attendees = [ new() { UserId = users[2].Id, IsHost = true } ]
            },
            new()
            {
                Title = "Annual Charity Table Tennis Tournament",
                Description = "A fast-paced single-elimination ping-pong tournament. Prizes will be awarded to the top three players, with all entry fees donated to charity.",
                StartDate = DateTime.UtcNow.AddDays(15),
                EndDate = DateTime.UtcNow.AddDays(15).AddHours(6),
                Category = "Sports",
                City = "Chicago",
                Venue = "Spin Chicago Table Tennis Club",
                Latitude = 41.8904,
                Longitude = -87.6272,
                PublicId = "UsersPhotos/dkjog5xkoyagr6gtewzk",
                ImageUrl = "https://res.cloudinary.com/df387hub9/image/upload/v1783326763/UsersPhotos/dkjog5xkoyagr6gtewzk.webp",
                Attendees = [ new() { UserId = users[0].Id, IsHost = true }, new() { UserId = users[2].Id } ]
            }
        };

        await context.Events.AddRangeAsync(events);
        await context.SaveChangesAsync();
    }
}
