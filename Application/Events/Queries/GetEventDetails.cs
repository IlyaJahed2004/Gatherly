using Application.Core;
using Application.Events.DTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events.Queries;

public class GetEventDetails
{
    /// <summary>
    /// MediatR query request.
    /// Returns Result<Event> — explicitly signals to the caller that
    /// this operation can succeed (with an Event) or fail (with an error + code).
    /// </summary>
    public class Query : IRequest<Result<EventDto>>
    {
        public required string Id { get; set; }
    }

    /// <summary>
    /// Handles fetching a single event by Id.
    /// Returns a Result instead of throwing — "not found" is an
    /// expected business outcome, not a crash.
    /// </summary>
    public class Handler(GatherlyDbContext context, IMapper mapper)
        : IRequestHandler<Query, Result<EventDto>>
    {
        public async Task<Result<EventDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var specificEvent = await context
                .Events.Include(e => e.Attendees)
                .ThenInclude(a => a.User)
                .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

            // Expected outcome — not a crash, not an exception.
            // Return a Failure result with 404 so the controller
            // can translate it to a proper HTTP response.
            if (specificEvent == null)
                return Result<EventDto>.Failure("Event not found", 404);

            // Happy path — wrap the found entity in a Success result
            return Result<EventDto>.Success(mapper.Map<EventDto>(specificEvent));
        }
    }
}
