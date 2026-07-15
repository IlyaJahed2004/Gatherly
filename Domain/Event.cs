using System;

namespace Domain;

public class Event
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public required string Description { get; set; }
    public required string Category { get; set; }
    public bool isCancelled { get; set; }

    public required string City { get; set; }
    public required string Venue { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    public string? ImageUrl { get; set; }
    public string? PublicId { get; set; }

    //navigation properties

    public ICollection<EventAttendee> Attendees { get; set; } = [];
    public ICollection<EventComment> Comments { get; set; } = [];
}
