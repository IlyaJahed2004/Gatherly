using MediatR;
using Persistence;

namespace Application.Events.Commands;

public class DeleteEvent
{
    public class Command : IRequest
    {
        public required string Id { get; set; }
    }

    public class Handler(GatherlyDbContext dbContext) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var targetEvent = await dbContext.Events.FindAsync(request.Id, cancellationToken)
                ?? throw new Exception("Event not found.");

            dbContext.Remove(targetEvent);

            await dbContext.SaveChangesAsync();
        }
    }
}
