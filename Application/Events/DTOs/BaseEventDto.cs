namespace Application.Events.DTOs;

public class BaseEventDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool isCancelled { get; set; }
    public string City { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
