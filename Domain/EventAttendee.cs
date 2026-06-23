namespace Domain;

public class EventAttendee
{
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    public string EventId { get; set; } = string.Empty;
    public Event Event { get; set; } = null!;

    public bool IsHost { get; set; }
}