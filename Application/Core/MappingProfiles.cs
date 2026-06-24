using Application.Events.DTOs;
using Application.Profiles.DTOs;
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
        string? currentUserId = null;

        // Used in UpdateEvent — copies property values from one
        // Event instance into another (avoids overwriting the tracked entity)
        CreateMap<Event, Event>();

        // Used in CreateEvent — converts the incoming CreateEventDto
        // into a full Event domain entity before saving to the database
        CreateMap<CreateEventDto, Event>();

        // Used in UpdateEvent — converts the incoming EditEventDto
        // into a full Event domain entity before saving to the database
        CreateMap<EditEventDto, Event>();

        CreateMap<Event, EventDto>()
            .ForMember(
                dest => dest.HostDisplayName,
                opt =>
                    opt.MapFrom(src =>
                        src.Attendees.FirstOrDefault(a => a.IsHost)!.User.DisplayName
                    )
            )
            .ForMember(
                dest => dest.HostId,
                opt => opt.MapFrom(src => src.Attendees.FirstOrDefault(a => a.IsHost)!.User.Id)
            );

        CreateMap<EventAttendee, UserProfile>()
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.User.Id))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.User.Bio))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.User.ImageUrl))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.User.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.User.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s =>
                s.User.Followers.Any(x => x.ObserverId == currentUserId)));

        CreateMap<User, UserProfile>()
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s =>
                s.Followers.Any(x => x.ObserverId == currentUserId)));
    }
}
