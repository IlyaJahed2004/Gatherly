namespace Application.Profiles.DTOs;

public class FollowerDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? ImageUrl { get; set; }
    public int FollowersCount { get; set; }
}