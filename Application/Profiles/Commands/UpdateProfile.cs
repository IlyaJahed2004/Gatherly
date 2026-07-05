using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Commands;

public class UpdateProfile
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string DisplayName { get; set; }
        public string? Bio { get; set; }
        public IFormFile? Image { get; set; }
        public bool DeleteImage { get; set; }
    }

    public class Handler(
        GatherlyDbContext dbContext,
        IUserAccessor userAccessor,
        IPhotoService photoService
    ) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users.FindAsync(userAccessor.GetUserId());
            if (user == null)
                return Result<Unit>.Failure("User not found", 404);

            // always update profile fields — frontend always sends current values
            user.DisplayName = request.DisplayName;
            user.Bio = request.Bio;

            // user explicitly deleted their photo
            if (request.DeleteImage && user.PublicId != null)
            {
                var deleteResult = await photoService.DeletePhoto(user.PublicId);
                if (deleteResult != "ok")
                    return Result<Unit>.Failure("Problem deleting photo", 400);

                user.ImageUrl = null;
                user.PublicId = null;
            }

            // user selected a new image — delete old one first to avoid orphans
            if (request.Image != null)
            {
                if (user.PublicId != null)
                    await photoService.DeletePhoto(user.PublicId);

                var uploadResult = await photoService.UploadPhoto(request.Image);
                if (uploadResult == null)
                    return Result<Unit>.Failure("Problem uploading photo", 400);

                user.ImageUrl = uploadResult.Url;
                user.PublicId = uploadResult.PublicId;
            }

            // single SaveChangesAsync covers all changes in one transaction
            await dbContext.SaveChangesAsync(cancellationToken);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
