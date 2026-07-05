using System.Diagnostics;
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
            },
            new User()
            {
                Id = "tom_id",
                DisplayName = "Tom",
                UserName = "tom@test.com",
                Email = "tom@test.com",
            },
            new User()
            {
                Id = "jane_id",
                DisplayName = "Jane",
                UserName = "jane@test.com",
                Email = "jane@test.com",
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
                Title = "مسابقات فوتبال دوستانه شمال تهران",
                Description = "یک بازی دوستانه ۱۱ به ۱۱ در زمین چمن مصنوعی الهیه. همراه داشتن استوک الزامی است.",
                StartDate = DateTime.UtcNow.AddDays(7),
                EndDate = DateTime.UtcNow.AddDays(7).AddHours(2),
                Category = "Sports",
                City = "Tehran",
                Venue = "Elahieh Sports Center",
                Latitude = 35.7892,
                Longitude = 51.4243,
                Attendees = [ new() { UserId = users[0].Id, IsHost = true }, new() { UserId = users[1].Id } ]
            },
            new()
            {
                Title = "سمینار هوش مصنوعی و آینده برنامه‌نویسی",
                Description = "بررسی تاثیر مدل‌های زبانی بزرگ (LLMs) بر روی معماری نرم‌افزار و آینده دات‌نت کارها.",
                StartDate = DateTime.UtcNow.AddDays(14),
                EndDate = DateTime.UtcNow.AddDays(14).AddHours(4),
                Category = "Science",
                City = "Tehran",
                Venue = "Tehran Book Garden - Amphitheater",
                Latitude = 35.7531,
                Longitude = 51.4502,
                Attendees = [ new() { UserId = users[2].Id, IsHost = true }, new() { UserId = users[0].Id } ]
            },
            new()
            {
                Title = "کارگاه تخصصی کوانتوم برای تازه‌واردها",
                Description = "در این جلسه به زبان ساده مفاهیم پایه محاسبات کوانتومی و کیوبیت‌ها را بررسی می‌کنیم.",
                StartDate = DateTime.UtcNow.AddDays(-5), // رویداد در گذشته
                EndDate = DateTime.UtcNow.AddDays(-5).AddHours(3),
                Category = "Science",
                City = "Isfahan",
                Venue = "Isfahan University of Technology",
                Latitude = 32.7208,
                Longitude = 51.5285,
                Attendees = [ new() { UserId = users[1].Id, IsHost = true } ]
            },
            new()
            {
                Title = "تور پیاده‌روی و عکاسی در کوچه پس کوچه‌های تجریش",
                Description = "یک گشت‌ و گذار دوستانه برای عکاسی از بافت قدیمی بازار تجریش و صرف آش در دربند.",
                StartDate = DateTime.UtcNow.AddMonths(1),
                EndDate = DateTime.UtcNow.AddMonths(1).AddHours(5),
                Category = "Leisure",
                City = "Tehran",
                Venue = "Tajrish Square",
                Latitude = 35.8051,
                Longitude = 51.4251,
                Attendees = [ new() { UserId = users[0].Id, IsHost = true }, new() { UserId = users[2].Id } ]
            },
            new()
            {
                Title = "جلسه نقد و بررسی کتاب معماری تمیز",
                Description = "دورهمی هفتگی برای بحث درباره فصل‌های پایانی کتاب Clean Architecture اثر رابرت مارتین.",
                StartDate = DateTime.UtcNow.AddDays(3),
                EndDate = DateTime.UtcNow.AddDays(3).AddHours(2),
                Category = "Other",
                City = "Tabriz",
                Venue = "Central Library of Tabriz",
                Latitude = 38.0758,
                Longitude = 46.2919,
                Attendees = [ new() { UserId = users[1].Id, IsHost = true } ]
            },
            new()
            {
                Title = "تمرین گروهی یوگا در پارک ملت",
                Description = "تمرین یوگا در فضای باز مناسب برای تمام سطوح. لطفا زیرانداز شخصی همراه داشته باشید.",
                StartDate = DateTime.UtcNow.AddDays(10),
                EndDate = DateTime.UtcNow.AddDays(10).AddHours(1.5),
                Category = "Sports",
                City = "Tehran",
                Venue = "Mellat Park",
                Latitude = 35.7761,
                Longitude = 51.4116,
                Attendees = [ new() { UserId = users[2].Id, IsHost = true }, new() { UserId = users[1].Id } ]
            },
            new()
            {
                Title = "وبینار امنیت در اپلیکیشن‌های وب",
                Description = "بررسی رایج‌ترین حفره‌های امنیتی در سال ۲۰۲۵ و راه‌های مقابله با آن‌ها در ASP.NET Core.",
                StartDate = DateTime.UtcNow.AddDays(20),
                EndDate = DateTime.UtcNow.AddDays(20).AddHours(2),
                Category = "Science",
                City = "Online",
                Venue = "Skyroom Platform",
                Latitude = 0,
                Longitude = 0,
                Attendees = [ new() { UserId = users[0].Id, IsHost = true } ]
            },
            new()
            {
                Title = "شب‌های مافیا در کافه بردگیم",
                Description = "یک دورهمی جذاب برای بازی مافیا همراه با آموزش رایگان برای افراد مبتدی.",
                StartDate = DateTime.UtcNow.AddDays(2),
                EndDate = DateTime.UtcNow.AddDays(2).AddHours(4),
                Category = "Leisure",
                City = "Shiraz",
                Venue = "BoardGame Cafe - Afif Abad",
                Latitude = 29.6231,
                Longitude = 52.5211,
                Attendees = [ new() { UserId = users[1].Id, IsHost = true }, new() { UserId = users[0].Id }, new() { UserId = users[2].Id } ]
            },
            new()
            {
                Title = "نمایشگاه تکنولوژی‌های فضایی",
                Description = "بازدید از آخرین دستاوردهای ایران و جهان در حوزه ماهواره‌برها و اکتشافات فضایی.",
                StartDate = DateTime.UtcNow.AddMonths(2),
                EndDate = DateTime.UtcNow.AddMonths(2).AddDays(3),
                Category = "Science",
                City = "Tehran",
                Venue = "International Exhibition Center",
                Latitude = 35.7909,
                Longitude = 51.3934,
                Attendees = [ new() { UserId = users[2].Id, IsHost = true } ]
            },
            new()
            {
                Title = "مسابقه تنیس روی میز جام رمضان",
                Description = "مسابقات حذفی پینگ‌پنگ با جوایز ارزنده برای نفرات اول تا سوم.",
                StartDate = DateTime.UtcNow.AddDays(15),
                EndDate = DateTime.UtcNow.AddDays(15).AddHours(6),
                Category = "Sports",
                City = "Mashhad",
                Venue = "Astadlou Sports Hall",
                Latitude = 36.2972,
                Longitude = 59.6067,
                Attendees = [ new() { UserId = users[0].Id, IsHost = true }, new() { UserId = users[2].Id } ]
            }
        };

        await context.Events.AddRangeAsync(events);
        await context.SaveChangesAsync();
    }
}
