using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Commands;

public class AddPhoto
{
    public class Command : IRequest<Result<PhotoUploadResult>>
    {
        public required IFormFile File { get; set; }
    }

    public class Handler(
        IUserAccessor userAccessor,
        GatherlyDbContext dbContext,
        IPhotoService photoService
    ) : IRequestHandler<Command, Result<PhotoUploadResult>>
    {
        public async Task<Result<PhotoUploadResult>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var user = await dbContext.Users.FindAsync(userAccessor.GetUserId());
            if (user == null)
                return Result<PhotoUploadResult>.Failure("User not found", 404);

            // If the user already has a photo, delete it from Cloudinary first.
            // Otherwise the old image becomes an orphan — still stored in Cloudinary,
            // taking up space, but no longer referenced anywhere in the database.
            if (user.PublicId != null)
            {
                var deleteResult = await photoService.DeletePhoto(user.PublicId);
                if (deleteResult != "ok")
                    return Result<PhotoUploadResult>.Failure("Problem deleting old photo", 400);
            }

            var uploadResult = await photoService.UploadPhoto(request.File);
            if (uploadResult == null)
                return Result<PhotoUploadResult>.Failure("Problem uploading photo", 400);

            user.ImageUrl = uploadResult.Url;
            user.PublicId = uploadResult.PublicId;

            var saved = await dbContext.SaveChangesAsync(cancellationToken) > 0;
            if (!saved)
                return Result<PhotoUploadResult>.Failure("Problem saving photo", 400);

            return Result<PhotoUploadResult>.Success(uploadResult);
        }
    }
}
