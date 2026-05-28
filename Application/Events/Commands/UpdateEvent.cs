using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Events.Commands;

public class UpdateEvent
{
    public class Command : IRequest<Result<Unit>>
    {
        public required Event Event { get; set; }
    }

    public class Handler(GatherlyDbContext dbContext, IMapper mapper)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command command, CancellationToken cancellationToken)
        {
            var existingEvent = await dbContext.Events.FindAsync(
                command.Event.Id,
                cancellationToken
            );

            if (existingEvent == null)
                return Result<Unit>.Failure("Event not found", 404);

            mapper.Map(command.Event, existingEvent);

            var result = await dbContext.SaveChangesAsync() > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to update the Event", 404);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
