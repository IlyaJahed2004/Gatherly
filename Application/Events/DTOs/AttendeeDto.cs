namespace Application.Events.DTOs;

public class AttendeeDto
{
    public string Id { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public bool IsHost { get; set; }
}