using Application.Core;
using Application.Events.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events.Queries;

public class GetEventComments
{
    /// <summary>
    /// MediatR query for fetching every comment posted under a given event,
    /// newest first — matches the order the frontend chat renders in
    /// (new comments are prepended to the top of the list).
    /// </summary>
    public class Query : IRequest<Result<List<EventCommentDto>>>
    {
        public required string EventId { get; set; }
    }

    public class Handler(GatherlyDbContext context, IMapper mapper)
        : IRequestHandler<Query, Result<List<EventCommentDto>>>
    {
        public async Task<Result<List<EventCommentDto>>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var eventExists = await context.Events.AnyAsync(
                x => x.Id == request.EventId,
                cancellationToken
            );

            if (!eventExists)
                return Result<List<EventCommentDto>>.Failure("Event not found", 404);

            // ProjectTo pushes the projection (and the join to AspNetUsers for
            // author info) down to SQL — same approach as GetEventDetails.
            var comments = await context
                .EventComments.Where(x => x.EventId == request.EventId)
                .OrderByDescending(x => x.CreatedAt)
                .ProjectTo<EventCommentDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return Result<List<EventCommentDto>>.Success(comments);
        }
    }
}