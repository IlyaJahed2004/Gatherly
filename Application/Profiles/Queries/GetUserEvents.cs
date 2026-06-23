using Application.Core;
using Application.Profiles.DTOs;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Domain;
using Persistence;

namespace Application.Profiles.Queries;

public class GetUserEvents
{

    public class Query : IRequest<Result<List<UserEventDto>>>
    {
        public required string Username { get; set; }
        public string Predicate { get; set; } = "future";
    }

    public class Handler(GatherlyDbContext context, UserManager<User> userManager)
        : IRequestHandler<Query, Result<List<UserEventDto>>>
    {
        public async Task<Result<List<UserEventDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByNameAsync(request.Username);
            if (user == null)
                return Result<List<UserEventDto>>.Failure("User not found", 404);

            var now = DateTime.UtcNow;

            var query = context.EventAttendees
                .Where(ea => ea.UserId == user.Id)
                .Include(ea => ea.Event)
                .AsQueryable();

            query = request.Predicate switch
            {
                "past"    => query.Where(ea => ea.Event.StartDate < now),
                "hosting" => query.Where(ea => ea.IsHost),
                _         => query.Where(ea => ea.Event.StartDate >= now),
            };

            var events = await query
                .OrderBy(ea => ea.Event.StartDate)
                .Select(ea => new UserEventDto
                {
                    Id        = ea.Event.Id,
                    Title     = ea.Event.Title,
                    Category  = ea.Event.Category,
                    StartDate = ea.Event.StartDate,
                })
                .ToListAsync(cancellationToken);

            return Result<List<UserEventDto>>.Success(events);
        }
    }
}