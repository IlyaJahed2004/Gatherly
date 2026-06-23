using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class IsHostRequirment : IAuthorizationRequirement { }

public class IsHostRequirmentHandler(
    GatherlyDbContext dbContext,
    IHttpContextAccessor httpContextAccessor
) : AuthorizationHandler<IsHostRequirment>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IsHostRequirment requirement
    )
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return;

        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext?.GetRouteValue("id") is not string eventId)
            return;

        var attendee = await dbContext
            .EventAttendees.AsNoTracking()
            .SingleOrDefaultAsync(x => x.UserId == userId && x.EventId == eventId);
        if (attendee == null)
            return;

        if (attendee.IsHost)
            context.Succeed(requirement);
    }
}
