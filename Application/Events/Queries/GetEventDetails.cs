using Application.Core;
using Application.Events.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events.Queries;

public class GetEventDetails
{
    /// <summary>
    /// MediatR query request for fetching a single event by Id.
    /// Returns Result<EventDto> — not the raw Event entity — because:
    ///   1. ProjectTo maps directly to the DTO at the database level.
    ///   2. EventDto breaks the circular reference that raw entities cause.
    ///   3. Only columns declared in EventDto are fetched — no sensitive fields leak.
    /// </summary>
    public class Query : IRequest<Result<EventDto>>
    {
        public required string Id { get; set; }
    }

    /// <summary>
    /// Handles the GetEventDetails query.
    /// Uses ProjectTo instead of Include/ThenInclude + mapper.Map to push
    /// the projection down to SQL — only the columns EventDto declares are fetched.
    /// </summary>
    public class Handler(GatherlyDbContext context, IMapper mapper)
        : IRequestHandler<Query, Result<EventDto>>
    {
        public async Task<Result<EventDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            // ProjectTo reads MappingProfiles at query-build time and translates
            // every ForMember into an IQueryable expression tree.
            // EF Core compiles that into a SQL SELECT with only the needed columns.
            // JOINs to EventAttendees and AspNetUsers are inferred automatically —
            // no Include/ThenInclude required.
            var specificEventDto = await context
                .Events.ProjectTo<EventDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

            // "Not found" is an expected business outcome, not a system error.
            // Return a typed Failure so the controller translates it to 404
            // without any exception being thrown.
            if (specificEventDto == null)
                return Result<EventDto>.Failure("Event not found", 404);

            return Result<EventDto>.Success(specificEventDto);
        }
    }
}
