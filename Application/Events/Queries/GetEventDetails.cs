using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Events.Queries;

public class GetEventDetails
{
    /// <summary>
    /// MediatR query request.
    /// Returns Result<Event> — explicitly signals to the caller that
    /// this operation can succeed (with an Event) or fail (with an error + code).
    /// </summary>
    public class Query : IRequest<Result<Event>>
    {
        public required string Id { get; set; }
    }

    /// <summary>
    /// Handles fetching a single event by Id.
    /// Returns a Result instead of throwing — "not found" is an
    /// expected business outcome, not a crash.
    /// </summary>
    public class Handler(GatherlyDbContext context) : IRequestHandler<Query, Result<Event>>
    {
        public async Task<Result<Event>> Handle(Query request, CancellationToken cancellationToken)
        {
            var specificEvent = await context.Events.FindAsync([request.Id], cancellationToken);

            // Expected outcome — not a crash, not an exception.
            // Return a Failure result with 404 so the controller
            // can translate it to a proper HTTP response.
            if (specificEvent == null)
                return Result<Event>.Failure("Event not found", 404);

            // Happy path — wrap the found entity in a Success result
            return Result<Event>.Success(specificEvent);
        }
    }
}
