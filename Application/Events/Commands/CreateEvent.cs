using Application.Core;
using Application.Events.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Events.Commands;

/// <summary>
/// CQRS Command that handles event creation.
/// Validation runs automatically via ValidationBehavior pipeline before this handler.
/// Returns Result<string> — wraps the new Event Id on success or error on failure.
/// </summary>
public class CreateEvent
{
    /// <summary>
    /// Carries the CreateEventDto from the API layer into the handler.
    /// Returns Result<string> wrapping the new Event Id.
    /// </summary>
    public class Command : IRequest<Result<string>>
    {
        /// <summary>
        /// DTO from the client — only permitted fields, no server-managed fields like Id.
        /// </summary>
        public required CreateEventDto EventDto { get; set; }
    }

    /// <summary>
    /// Handles the CreateEvent command.
    /// IUserAccessor is injected to identify the current logged-in user
    /// so they can be assigned as the host of the newly created event.
    /// IPhotoService is injected to handle the optional image upload to Cloudinary.
    /// </summary>
    public class Handler(
        GatherlyDbContext dbContext,
        IMapper mapper,
        IUserAccessor userAccessor,
        IPhotoService photoService
    ) : IRequestHandler<Command, Result<string>>
    {
        /// <summary>
        /// Creates the event, optionally uploads a photo, assigns the current
        /// user as host, and saves everything to the database.
        /// </summary>
        public async Task<Result<string>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            // Fetch the current logged-in user from HttpContext claims via IUserAccessor.
            // They will be assigned as the host of this event.
            var user = await userAccessor.GetUserAsync();

            // Map CreateEventDto → Event entity.
            // AutoMapper fills in all matching properties automatically.
            // request.EventDto.Image has no matching Event property — AutoMapper
            // silently skips it, handled manually below instead.
            var eventEntity = mapper.Map<Event>(request.EventDto);

            // Optional photo upload — no old photo to worry about on create,
            // so this is simpler than the UpdateEvent version (no delete-first branch).
            if (request.EventDto.Image != null)
            {
                var uploadResult = await photoService.UploadEventPhoto(request.EventDto.Image);
                if (uploadResult == null)
                    return Result<string>.Failure("Problem uploading photo", 400);

                eventEntity.ImageUrl = uploadResult.Url;
                eventEntity.PublicId = uploadResult.PublicId;
            }

            dbContext.Events.Add(eventEntity);

            // Create an EventAttendee join record for the creator.
            // IsHost = true — the person creating the event is automatically the host.
            // This record links the new event to the current user in the EventAttendees table.
            var attendee = new EventAttendee
            {
                EventId = eventEntity.Id,
                UserId = user.Id,
                IsHost = true,
            };

            // Add the host attendee to the event's Attendees collection.
            // EF Core will persist this join record when SaveChangesAsync is called.
            eventEntity.Attendees.Add(attendee);

            // SaveChangesAsync returns the number of rows affected.
            // Event row, EventAttendee row (and Cloudinary metadata if uploaded) all saved together.
            var success = await dbContext.SaveChangesAsync(cancellationToken) > 0;

            if (!success)
                return Result<string>.Failure("Failed to create the event", 400);

            return Result<string>.Success(eventEntity.Id);
        }
    }
}
