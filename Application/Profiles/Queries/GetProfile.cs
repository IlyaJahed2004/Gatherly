using Application.Core;
using Application.Profiles.DTOs;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Domain;
using Persistence;

namespace Application.Profiles.Queries;

public class GetProfile
{
    public class Query : IRequest<Result<ProfileDto>>
    {
        public required string Username { get; set; }
        public required string CurrentUsername { get; set; }
    }

    public class Handler(GatherlyDbContext context, UserManager<User> userManager)
        : IRequestHandler<Query, Result<ProfileDto>>
    {
        public async Task<Result<ProfileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await userManager.Users
                .Include(u => u.Followers)
                .Include(u => u.Followings)
                .FirstOrDefaultAsync(u => u.UserName == request.Username, cancellationToken);

            if (user == null)
                return Result<ProfileDto>.Failure("User not found", 404);

            var currentUser = await userManager.FindByNameAsync(request.CurrentUsername);

            var isFollowing = currentUser != null && await context.UserFollowings
                .AnyAsync(uf => uf.ObserverId == currentUser.Id && uf.TargetId == user.Id, cancellationToken);

            return Result<ProfileDto>.Success(new ProfileDto
            {
                Id              = user.Id,
                Username        = user.UserName!,
                DisplayName     = user.DisplayName,
                Bio             = user.Bio,
                ImageUrl        = user.ImageUrl,
                FollowersCount  = user.Followers.Count,
                FollowingsCount = user.Followings.Count,
                IsFollowing     = isFollowing,
                IsCurrentUser   = user.UserName == request.CurrentUsername,
            });
        }
    }
}