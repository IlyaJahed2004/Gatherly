using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events.Commands;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(IUserAccessor userAccessor, GatherlyDbContext dbContext) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var targetEvent = await dbContext.Events
                .Include(x => x.Attendees)
                .ThenInclude(x => x.User)
                .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        
            if(targetEvent == null)
                return Result<Unit>.Failure("Event not found", 404);

            var user = await userAccessor.GetUserAsync();

            var attendance = targetEvent.Attendees.FirstOrDefault(x => x.UserId == user.Id);
            var isHost = targetEvent.Attendees.Any(x => x.IsHost && x.UserId == user.Id);

            if(attendance != null)
            {
                if (isHost)
                    targetEvent.isCancelled = !targetEvent.isCancelled; //Whatever it is, it's gonna be opposite
                else
                    targetEvent.Attendees.Remove(attendance);
            }
            else
            {
                //A normal new attendee
                targetEvent.Attendees.Add(new EventAttendee()
                {
                    UserId = user.Id,
                    EventId = targetEvent.Id,
                    IsHost = false
                });
            }

            var result = await dbContext.SaveChangesAsync(cancellationToken) > 0;

            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating the database", 400);
        }
}}
