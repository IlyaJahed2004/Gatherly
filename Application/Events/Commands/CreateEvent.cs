using Application.Core;
using Application.Events.DTOs;
using AutoMapper;
using Domain;
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
///
/// Returns Result<string> instead of throwing — the handler explicitly signals
/// success (with the new Event Id) or failure (with an error message and status code).
/// </summary>
public class CreateEvent
{
    /// <summary>
    /// The MediatR request object.
    /// Carries the CreateEventDto from the API layer into the handler.
    /// Returns Result<string> — wraps the new Event Id on success,
    /// or an error message + status code on failure.
    /// </summary>
    public class Command : IRequest<Result<string>>
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
        : IRequestHandler<Command, Result<string>>
    {
        /// <summary>
        /// Maps the incoming DTO to a domain entity, persists it to the database,
        /// and returns a Result wrapping the new Event Id.
        /// By the time this runs, validation has already passed via the pipeline.
        /// Returns Result.Failure if the database did not confirm the write.
        /// Returns Result.Success with the new Id if the write was confirmed.
        /// </summary>
        public async Task<Result<string>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            // Map CreateEventDto → Event entity.
            // AutoMapper fills in all matching properties automatically.
            // Server-managed fields (Id, etc.) are handled separately.
            var eventEntity = mapper.Map<Event>(request.EventDto);

            // Stage the new entity for insertion
            dbContext.Events.Add(eventEntity);

            // SaveChangesAsync returns the number of rows affected.
            // If greater than 0, the write was confirmed by the database.
            var success = await dbContext.SaveChangesAsync(cancellationToken) > 0;

            // Database did not confirm the write — no rows were affected.
            // This is an unexpected failure at the persistence level, not a
            // business rule violation, so we signal it via Result.Failure.
            if (!success)
                return Result<string>.Failure("Failed to create the event", 400);

            // Write confirmed — return the generated Id so the client
            // knows where to find the newly created resource.
            return Result<string>.Success(eventEntity.Id);
        }
    }
}
