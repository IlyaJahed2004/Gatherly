using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }

    public ICollection<EventAttendee> Events { get; set; } = new List<EventAttendee>();
    public ICollection<UserFollowing> Followings { get; set; } = new List<UserFollowing>();
    public ICollection<UserFollowing> Followers { get; set; } = new List<UserFollowing>();
}