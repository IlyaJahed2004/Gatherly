using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Events.Commands;

public class UpdateEvent
{
    public class Command : IRequest
    {
        public required Event Event { get; set; }
    }

    public class Handler(GatherlyDbContext dbContext, IMapper mapper) : IRequestHandler<Command>
    {
        public async Task Handle(Command command, CancellationToken cancellationToken)
        {
            var existingEvent =
                await dbContext.Events.FindAsync(command.Event.Id, cancellationToken)
                ?? throw new Exception("Event not found.");

            mapper.Map(command.Event, existingEvent);

            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
