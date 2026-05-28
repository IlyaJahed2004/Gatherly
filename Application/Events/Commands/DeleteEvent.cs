using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Events.Commands;

public class DeleteEvent
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(GatherlyDbContext dbContext) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var targetEvent = await dbContext.Events.FindAsync(request.Id, cancellationToken);

            if (targetEvent == null)
                return Result<Unit>.Failure("Event not found", 404);

            dbContext.Remove(targetEvent);

            var result = await dbContext.SaveChangesAsync() > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to delete the Event", 404);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
