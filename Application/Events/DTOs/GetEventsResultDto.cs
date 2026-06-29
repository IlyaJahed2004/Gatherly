using Application.Core;

namespace Application.Events.DTOs;

public class GetEventsResultDto
{
    public required PagedList<EventDto> PagedEvents { get; set; }
    public DateTime CurrentDate { get; set; }
}

