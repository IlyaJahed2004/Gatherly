using Application.Core;
using Application.Events.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetEvents
{
    public class Query : IRequest<Result<List<EventDto>>>
    {
        public required string UserId { get; set; }
        public ProfileEventType EventType { get; set; } = ProfileEventType.Past;
    }

    public class Handler(GatherlyDbContext dbContext, IMapper mapper) : IRequestHandler<Query, Result<List<EventDto>>>
    {
        public async Task<Result<List<EventDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            if (!Enum.IsDefined(typeof(ProfileEventType), request.EventType))
            {
                return Result<List<EventDto>>.Failure("Invalid event type", 400);
            }

            var userExists = await dbContext.Users.AnyAsync(u => u.Id == request.UserId, cancellationToken);
            if (!userExists)
            {
                return Result<List<EventDto>>.Failure("User not found", 404);
            }

            var query = dbContext.Events.AsNoTracking().AsQueryable();
            var currentDate = DateTime.UtcNow;

            query = request.EventType switch
            {
                ProfileEventType.Past => query.Where(x =>
                    x.StartDate < currentDate &&
                    x.Attendees.Any(a => a.UserId == request.UserId && !a.IsHost)),

                ProfileEventType.Future => query.Where(x =>
                    x.StartDate >= currentDate &&
                    x.Attendees.Any(a => a.UserId == request.UserId && !a.IsHost)),

                ProfileEventType.Host => query.Where(x =>
                    x.Attendees.Any(a => a.UserId == request.UserId && a.IsHost)),

                _ => query
            };

            query = request.EventType == ProfileEventType.Past
                ? query.OrderByDescending(x => x.StartDate)
    :           query.OrderBy(x => x.StartDate);

            var result = await query
                .ProjectTo<EventDto>(mapper.ConfigurationProvider, new { request.UserId })
                .ToListAsync(cancellationToken);

            return Result<List<EventDto>>.Success(result);
        }
    }
}
