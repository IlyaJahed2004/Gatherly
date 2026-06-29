using Application.Core;
using Application.Events.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events.Queries
{
    /// <summary>
    /// Container class that encapsulates the CQRS Query definition
    /// and its corresponding execution Handler for retrieving all events.
    /// </summary>
    public class GetEventList
    {
        // 1. THE CQRS QUERY (The Read Message Contract)
        // Implements 'IRequest<TResponse>' to define this class as a MediatR message.
        // It holds no behavior or state, serving purely as a data transfer contract.
        // The generic argument specifies that the mediator must return a 'List<Domain.Event>' upon execution.
        public class Query : IRequest<Result<GetEventsResultDto>>
        {
            public GetEventsParams Params { get; set; }
        }

        // 2. THE CQRS HANDLER (The Use Case Processor)
        // Implements 'IRequestHandler<TRequest, TResponse>' to register this class as the executor for the Query.
        // - 'Query': Specifies the exact incoming message type this handler is bound to.
        // - 'List<Domain.Event>': Represents the explicit return type, matching the Query's contract.
        // The 'GatherlyDbContext' infrastructure dependency is injected via the primary constructor.
        public class Handler(GatherlyDbContext context, IMapper mapper, IUserAccessor userAccessor)
            : IRequestHandler<Query, Result<GetEventsResultDto>>
        {
            // 3. THE HANDLER EXECUTION METHOD
            // Automatically invoked by the MediatR pipeline when 'IMediator.Send()' dispatches the Query.
            // - 'request': The captured query instance containing request parameters (empty in this context).
            // - 'cancellationToken': Propagates notification that the network request or operation should be aborted.
            public async Task<Result<GetEventsResultDto>> Handle(
                Query request,
                CancellationToken cancellationToken
            )
            {
                // Executes an asynchronous, non-blocking fetch operation against the database infrastructure.
                // The API controller remains completely decoupled from this underlying EF Core data access logic.
                var query = context.Events.AsQueryable();

                var filterDate = request.Params.StartDate ?? DateTime.UtcNow;
                query = query.Where(x => x.StartDate >= filterDate);

                if (request.Params.Category != EventCategoryParam.None)
                {
                    var categoryName = request.Params.Category.ToString();
                    query = query.Where(x => x.Category == categoryName);
                }

                query = query.OrderBy(x => x.StartDate);

                var totalCount = await query.CountAsync(cancellationToken);

                var currentUserId = userAccessor.GetUserId();

                var eventsDto = await query
                    .Skip((request.Params.PageNumber - 1) * request.Params.PageSize)
                    .Take(request.Params.PageSize)
                    .ProjectTo<EventDto>(mapper.ConfigurationProvider, new { currentUserId })
                    .ToListAsync(cancellationToken);

                var pagedList = new PagedList<EventDto>
                {
                    Items = eventsDto,
                    PageNumber = request.Params.PageNumber,
                    PageSize = request.Params.PageSize,
                    TotalCount = totalCount,
                };

                var result = new GetEventsResultDto()
                { 
                    PagedEvents = pagedList,
                    CurrentDate = DateTime.UtcNow
                };

                return Result<GetEventsResultDto>.Success(result);
            }
        }
    }
}
