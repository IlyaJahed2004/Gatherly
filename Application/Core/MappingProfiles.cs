using Application.Events.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core;

/// <summary>
/// Registers all AutoMapper mappings for the application.
/// Add a new CreateMap entry here whenever a new DTO ↔ Entity
/// conversion is needed.
/// </summary>
public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // Used in UpdateEvent — copies property values from one
        // Event instance into another (avoids overwriting the tracked entity)
        CreateMap<Event, Event>();

        // Used in CreateEvent — converts the incoming CreateEventDto
        // into a full Event domain entity before saving to the database
        CreateMap<CreateEventDto, Event>();
    }
}
