using Application.Events.DTOs;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Events.Commands;

/// <summary>
/// CQRS Command responsible for handling the creation of a new event.
/// Follows the MediatR pattern: Command defines the request,
/// Handler contains the business logic.
///
/// Validation is handled in the Application layer via FluentValidation,
/// because validation is business logic — the API layer just forwards the request.
/// Validation runs automatically via ValidationBehavior pipeline before this
/// handler is ever called — see Application/Core/ValidationBehavior.cs
/// and Validators/CreateEventValidator.cs.
/// </summary>
public class CreateEvent
{
    /// <summary>
    /// The MediatR request object.
    /// Carries the CreateEventDto from the API layer into the handler.
    /// Returns the newly created Event's Id as a string.
    /// </summary>
    public class Command : IRequest<string>
    {
        /// <summary>
        /// The DTO received from the client.
        /// AutoMapper will convert this into a full Event entity inside the handler.
        /// Only permitted fields are exposed — server-managed fields like Id
        /// are intentionally absent from the DTO.
        /// </summary>
        public required CreateEventDto EventDto { get; set; }
    }

    /// <summary>
    /// Handles the CreateEvent command.
    /// Dependencies are injected via primary constructor (C# 12).
    /// No validator injected here — validation is handled upstream
    /// by ValidationBehavior in the MediatR pipeline automatically.
    /// </summary>
    public class Handler(GatherlyDbContext dbContext, IMapper mapper)
        : IRequestHandler<Command, string>
    {
        /// <summary>
        /// Maps the incoming DTO to a domain entity,
        /// persists it to the database, and returns the new Id.
        /// By the time this runs, validation has already passed.
        /// </summary>
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            // Map CreateEventDto → Event entity.
            // AutoMapper fills in all matching properties automatically.
            // Server-managed fields (Id, etc.) are handled separately.
            var eventEntity = mapper.Map<Event>(request.EventDto);

            // Stage the new entity for insertion
            dbContext.Events.Add(eventEntity);

            // Commit to the database
            await dbContext.SaveChangesAsync(cancellationToken);

            // Return the generated Id so the client knows where to find the new resource
            return eventEntity.Id;
        }
    }
}
