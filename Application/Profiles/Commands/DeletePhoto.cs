using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands
{
    public class DeletePhoto
    {
        public class Command : IRequest<Result<Unit>> { }

        public class Handler(
            IUserAccessor userAccessor,
            GatherlyDbContext dbContext,
            IPhotoService photoService
        ) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var user = await dbContext.Users.FindAsync(userAccessor.GetUserId());
                if (user == null)
                    return Result<Unit>.Failure("User not found", 404);

                if (user.PublicId == null)
                    return Result<Unit>.Failure("No photo to delete", 400);

                var deleteResult = await photoService.DeletePhoto(user.PublicId);
                if (deleteResult != "ok")
                    return Result<Unit>.Failure("Problem deleting photo", 400);

                user.PublicId = null;
                user.ImageUrl = null;

                var saved = await dbContext.SaveChangesAsync(cancellationToken) > 0;
                if (!saved)
                    return Result<Unit>.Failure("Problem saving changes", 400);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
