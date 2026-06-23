using Application.Core;
using Application.Profiles.DTOs;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Domain;
using Persistence;

namespace Application.Profiles.Queries;

public class GetFollowings
{
    public class Query : IRequest<Result<List<FollowerDto>>>
    {
        public required string Username { get; set; }

        public required string Predicate { get; set; }
    }

    public class Handler(GatherlyDbContext context, UserManager<User> userManager)
        : IRequestHandler<Query, Result<List<FollowerDto>>>
    {
        public async Task<Result<List<FollowerDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByNameAsync(request.Username);
            if (user == null)
                return Result<List<FollowerDto>>.Failure("User not found", 404);

            List<FollowerDto> result;

            if (request.Predicate == "followers")
            {
                result = await context.UserFollowings
                    .Where(uf => uf.TargetId == user.Id)
                    .Include(uf => uf.Observer)
                        .ThenInclude(u => u.Followers)
                    .Select(uf => new FollowerDto
                    {
                        Id             = uf.Observer.Id,
                        Username       = uf.Observer.UserName!,
                        DisplayName    = uf.Observer.DisplayName,
                        ImageUrl       = uf.Observer.ImageUrl,
                        FollowersCount = uf.Observer.Followers.Count,
                    })
                    .ToListAsync(cancellationToken);
            }
            else
            {
                result = await context.UserFollowings
                    .Where(uf => uf.ObserverId == user.Id)
                    .Include(uf => uf.Target)
                        .ThenInclude(u => u.Followers)
                    .Select(uf => new FollowerDto
                    {
                        Id             = uf.Target.Id,
                        Username       = uf.Target.UserName!,
                        DisplayName    = uf.Target.DisplayName,
                        ImageUrl       = uf.Target.ImageUrl,
                        FollowersCount = uf.Target.Followers.Count,
                    })
                    .ToListAsync(cancellationToken);
            }

            return Result<List<FollowerDto>>.Success(result);
        }
    }
}