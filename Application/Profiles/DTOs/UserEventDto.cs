namespace Application.Profiles.DTOs;

public class UserEventDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public string? ImageUrl { get; set; }
}