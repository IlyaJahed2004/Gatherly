using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events.Commands;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string EventId { get; set; }
        public required string Username { get; set; }
    }

    public class Handler(
        GatherlyDbContext context,
        UserManager<User> userManager)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByNameAsync(request.Username);
            if (user == null)
                return Result<Unit>.Failure("User not found", 401);

            var @event = await context.Events
                .Include(e => e.Attendees)
                .FirstOrDefaultAsync(e => e.Id == request.EventId, cancellationToken);

            if (@event == null)
                return Result<Unit>.Failure("Event not found", 404);

            var attendance = @event.Attendees.FirstOrDefault(a => a.UserId == user.Id);

            if (attendance != null && attendance.IsHost)
            {
                @event.isCancelled = !@event.isCancelled;
            }
            else if (attendance != null)
            {
                @event.Attendees.Remove(attendance);
            }
            else
            {
                @event.Attendees.Add(new EventAttendee
                {
                    UserId  = user.Id,
                    EventId = @event.Id,
                    IsHost  = false,
                });
            }

            var success = await context.SaveChangesAsync(cancellationToken) > 0;
            return success
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to update attendance", 400);
        }
    }
}