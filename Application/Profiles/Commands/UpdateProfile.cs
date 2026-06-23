using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Domain;

namespace Application.Profiles.Commands;

public class UpdateProfile
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Username { get; set; }
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
    }

    public class Handler(UserManager<User> userManager)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByNameAsync(request.Username);
            if (user == null)
                return Result<Unit>.Failure("User not found", 404);

            user.DisplayName = request.DisplayName ?? user.DisplayName;
            user.Bio         = request.Bio ?? user.Bio;

            var result = await userManager.UpdateAsync(user);
            return result.Succeeded
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to update profile", 400);
        }
    }
}