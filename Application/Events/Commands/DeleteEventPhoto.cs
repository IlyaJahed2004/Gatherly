using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Events.Commands;

public class DeleteEventPhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string EventId { get; set; }
    }

    public class Handler(GatherlyDbContext dbContext, IPhotoService photoService)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var ev = await dbContext.Events.FindAsync(request.EventId);
            if (ev == null)
                return Result<Unit>.Failure("Event not found", 404);

            if (ev.PublicId == null)
                return Result<Unit>.Failure("No photo to delete", 400);

            var deleteResult = await photoService.DeletePhoto(ev.PublicId);
            if (deleteResult != "ok")
                return Result<Unit>.Failure("Problem deleting photo", 400);

            ev.ImageUrl = null;
            ev.PublicId = null;

            var saved = await dbContext.SaveChangesAsync(cancellationToken) > 0;
            if (!saved)
                return Result<Unit>.Failure("Problem saving changes", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
