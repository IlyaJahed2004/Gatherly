using Application.Core;
using Application.Events.DTOs;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Events.Commands;

public class UpdateEvent
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
        public required EditEventDto EventDto { get; set; }
    }

    public class Handler(GatherlyDbContext dbContext, IMapper mapper, IPhotoService photoService)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command command, CancellationToken cancellationToken)
        {
            var existingEvent = await dbContext.Events.FindAsync([command.Id], cancellationToken);

            if (existingEvent == null)
                return Result<Unit>.Failure("Event not found", 404);

            // map plain fields (Title, Description, City, etc.)
            mapper.Map(command.EventDto, existingEvent);

            // user explicitly deleted the photo
            if (command.EventDto.DeleteImage && existingEvent.PublicId != null)
            {
                var deleteResult = await photoService.DeletePhoto(existingEvent.PublicId);
                if (deleteResult != "ok")
                    return Result<Unit>.Failure("Problem deleting photo", 400);

                existingEvent.ImageUrl = null;
                existingEvent.PublicId = null;
            }

            // user selected a new photo — delete old one first to avoid orphan
            if (command.EventDto.Image != null)
            {
                if (existingEvent.PublicId != null)
                    await photoService.DeletePhoto(existingEvent.PublicId);

                var uploadResult = await photoService.UploadPhoto(command.EventDto.Image);
                if (uploadResult == null)
                    return Result<Unit>.Failure("Problem uploading photo", 400);

                existingEvent.ImageUrl = uploadResult.Url;
                existingEvent.PublicId = uploadResult.PublicId;
            }

            await dbContext.SaveChangesAsync(cancellationToken);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
