using Application.Profiles.DTOs;

namespace Application.Events.DTOs;

public class EventDto
{
    // core event info
    public required string Id { get; set; }
    public required string Title { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public required string Description { get; set; }
    public required string Category { get; set; }
    public bool IsCancelled { get; set; }

    // location
    public required string City { get; set; }
    public required string Venue { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    // host — flattened from EventAttendee where IsHost = true
    public required string HostId { get; set; }
    public required string HostDisplayName { get; set; }

    // cover photo — null if no photo uploaded yet
    public string? ImageUrl { get; set; }

    // current user's relationship to this event — both false if unrelated
    public bool IsHost { get; set; }
    public bool IsGoing { get; set; }

    // attendees list — UserProfile breaks the circular reference
    public ICollection<UserProfile> Attendees { get; set; } = [];
}
