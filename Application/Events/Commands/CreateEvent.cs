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
    /// </summary>
    public class Handler(GatherlyDbContext dbContext, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<string>>
    {
        /// <summary>
        /// Creates the event, assigns the current user as host, and saves to the database.
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
            var eventEntity = mapper.Map<Event>(request.EventDto);

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
            // Both the Event row and the EventAttendee row must be written.
            var success = await dbContext.SaveChangesAsync(cancellationToken) > 0;

            if (!success)
                return Result<string>.Failure("Failed to create the event", 400);

            return Result<string>.Success(eventEntity.Id);
        }
    }
}
