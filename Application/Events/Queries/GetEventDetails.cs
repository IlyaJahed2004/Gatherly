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
    public class Query : IRequest<Result<EventDetailsDto>>
    {
        public required string Id { get; set; }
    }

    public class Handler(GatherlyDbContext context, IMapper mapper)
        : IRequestHandler<Query, Result<EventDetailsDto>>
    {
        public async Task<Result<EventDetailsDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var eventDto = await context.Events
                .Include(e => e.Attendees)
                    .ThenInclude(a => a.User)
                .ProjectTo<EventDetailsDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

            if (eventDto == null)
                return Result<EventDetailsDto>.Failure("Event not found", 404);

            return Result<EventDetailsDto>.Success(eventDto);
        }
    }
}