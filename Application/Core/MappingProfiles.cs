using Application.Events.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Event, Event>();
        CreateMap<CreateEventDto, Event>();
        CreateMap<EditEventDto, Event>();

        // EventAttendee → AttendeeDto
        CreateMap<EventAttendee, AttendeeDto>()
            .ForMember(d => d.Id,          o => o.MapFrom(s => s.User.Id))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.ImageUrl,    o => o.MapFrom(s => s.User.ImageUrl))
            .ForMember(d => d.IsHost,      o => o.MapFrom(s => s.IsHost));

        // Event → EventDetailsDto (شامل attendees)
        CreateMap<Event, EventDetailsDto>()
            .ForMember(d => d.IsCancelled, o => o.MapFrom(s => s.isCancelled));
    }
}