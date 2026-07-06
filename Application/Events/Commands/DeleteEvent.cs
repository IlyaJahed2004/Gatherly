using Application.Core;
using Application.Interfaces;
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

    public class Handler(GatherlyDbContext dbContext, IPhotoService photoService)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var targetEvent = await dbContext.Events.FindAsync(request.Id, cancellationToken);

            if (targetEvent == null)
                return Result<Unit>.Failure("Event not found", 404);

            // Delete the Cloudinary image first, before removing the row —
            // if this fails, we still have the Event row + PublicId to retry with later.
            // If we deleted the row first and then Cloudinary failed, we'd lose
            // the PublicId forever and orphan the image with no way to clean it up.
            if (targetEvent.PublicId != null)
            {
                var deleteResult = await photoService.DeletePhoto(targetEvent.PublicId);
                if (deleteResult != "ok")
                    return Result<Unit>.Failure("Problem deleting event photo", 400);
            }

            dbContext.Remove(targetEvent);

            var result = await dbContext.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to delete the Event", 404);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}