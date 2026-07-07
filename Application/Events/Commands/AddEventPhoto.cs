using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Events.Commands;

public class AddEventPhoto
{
    public class Command : IRequest<Result<PhotoUploadResult>>
    {
        public required string EventId { get; set; }
        public required IFormFile File { get; set; }
    }

    public class Handler(GatherlyDbContext dbContext, IPhotoService photoService)
        : IRequestHandler<Command, Result<PhotoUploadResult>>
    {
        public async Task<Result<PhotoUploadResult>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var ev = await dbContext.Events.FindAsync(request.EventId);
            if (ev == null)
                return Result<PhotoUploadResult>.Failure("Event not found", 404);

            // Delete old photo from Cloudinary before uploading the new one.
            // Without this, the old image becomes an orphan in Cloudinary storage.
            if (ev.PublicId != null)
            {
                var deleteResult = await photoService.DeletePhoto(ev.PublicId);
                if (deleteResult != "ok")
                    return Result<PhotoUploadResult>.Failure("Problem deleting old photo", 400);
            }

            var uploadResult = await photoService.UploadEventPhoto(request.File);
            if (uploadResult == null)
                return Result<PhotoUploadResult>.Failure("Problem uploading photo", 400);

            ev.ImageUrl = uploadResult.Url;
            ev.PublicId = uploadResult.PublicId;

            var saved = await dbContext.SaveChangesAsync(cancellationToken) > 0;
            if (!saved)
                return Result<PhotoUploadResult>.Failure("Problem saving photo", 400);

            return Result<PhotoUploadResult>.Success(uploadResult);
        }
    }
}
