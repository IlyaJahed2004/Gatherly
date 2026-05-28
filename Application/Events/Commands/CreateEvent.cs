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
/// Validation is handled in the Application layer (not API) via FluentValidation,
/// because validation is business logic — the API layer just forwards the request.
/// The validator for this command lives in: Validators/CreateEventValidator.cs
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
    ///
    /// IValidator&lt;Command&gt; is injected by the DI container and resolved to
    /// CreateEventValidator automatically — registered via
    /// AddValidatorsFromAssemblyContaining in Program.cs.
    /// </summary>
    public class Handler(GatherlyDbContext dbContext, IMapper mapper, IValidator<Command> validator)
        : IRequestHandler<Command, string>
    {
        /// <summary>
        /// Validates the command, maps the DTO to a domain entity,
        /// persists it to the database, and returns the new Id.
        /// </summary>
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            // Run FluentValidation rules defined in CreateEventValidator.
            // ValidateAndThrowAsync automatically throws a ValidationException
            // if any rule fails — execution stops here and never reaches the db.
            // Note: in a Pipeline Behaviour approach this call moves to a central
            // ValidationBehaviour and is removed from the handler entirely.
            await validator.ValidateAndThrowAsync(request, cancellationToken);

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
