using System;

namespace Domain;

public class EventComment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public required string EventId { get; set; } // FK → Event
    public Event Event { get; set; } = null!; // navigation to Event

    public required string UserId { get; set; } // FK → User
    public User User { get; set; } = null!; // navigation to User

    public required string Message { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}