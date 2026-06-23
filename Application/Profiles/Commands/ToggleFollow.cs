using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Commands;

public class ToggleFollow
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string ObserverUsername { get; set; }

        public required string TargetUsername { get; set; }
    }

    public class Handler(GatherlyDbContext context, UserManager<User> userManager)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await userManager.FindByNameAsync(request.ObserverUsername);
            var target   = await userManager.FindByNameAsync(request.TargetUsername);

            if (observer == null || target == null)
                return Result<Unit>.Failure("User not found", 404);

            if (observer.Id == target.Id)
                return Result<Unit>.Failure("You cannot follow yourself", 400);

            var existing = await context.UserFollowings
                .FindAsync([observer.Id, target.Id], cancellationToken);

            if (existing == null)
            {
                // Follow
                context.UserFollowings.Add(new UserFollowing
                {
                    ObserverId = observer.Id,
                    TargetId   = target.Id,
                });
            }
            else
            {
                // Unfollow
                context.UserFollowings.Remove(existing);
            }

            var success = await context.SaveChangesAsync(cancellationToken) > 0;
            return success
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to update follow", 400);
        }
    }
}