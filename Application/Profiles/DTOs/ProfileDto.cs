namespace Application.Profiles.DTOs;

public class ProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
    public int FollowersCount { get; set; }
    public int FollowingsCount { get; set; }

    public bool IsFollowing { get; set; }

    public bool IsCurrentUser { get; set; }
}