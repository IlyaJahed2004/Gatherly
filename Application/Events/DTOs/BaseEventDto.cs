namespace Application.Events.DTOs;

public class BaseEventDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public EventCategory? Category { get; set; }
    public bool isCancelled { get; set; }
    public string City { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public enum EventCategory
{
    Sports = 1,
    Science = 2,
    Leisure = 3,
    Other = 4
}
