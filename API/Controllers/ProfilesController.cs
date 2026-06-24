using Application.Profiles.Commands;
using Application.Profiles.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController(IMediator mediator) : BaseApiController
{
    [HttpPost("{userId}/follow")]
    public async Task<ActionResult> FollowToggle(string userId)
    {
        var result = await mediator.Send(new FollowToggle.Command() { TargetUserId  = userId });

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess && result.Value != null)
            return Ok(result.Value);

        return BadRequest(result.Error);
    }

    [HttpGet("{userId}/follow-list")]
    public async Task<ActionResult> GetFollowings(string userId, string predicate)
    {
        var result = await mediator.Send(new GetFollowings.Query { UserId = userId, Predicate = predicate });

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess && result.Value != null)
            return Ok(result.Value);

        return BadRequest(result.Error);
    }
}
