using Application.Core;
using Application.Profiles.Commands;
using Application.Profiles.DTOs;
using Application.Profiles.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController(IMediator mediator) : BaseApiController
{
    [HttpPost("add-photo")]
    public async Task<ActionResult> AddPhoto([FromForm] IFormFile file)
    {
        var result = await mediator.Send(new AddPhoto.Command() { File = file });

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess && result.Value != null)
            return Ok(result.Value);

        return BadRequest(result.Error);
    }

    [HttpDelete("delete-photo")]
    public async Task<ActionResult> DeletePhoto()
    {
        var result = await mediator.Send(new DeletePhoto.Command());

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess)
            return Ok();

        return BadRequest(result.Error);
    }

    [HttpPost("{userId}/follow")]
    public async Task<ActionResult> FollowToggle(string userId)
    {
        var result = await mediator.Send(new FollowToggle.Command() { TargetUserId = userId });

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess && result.Value != null)
            return Ok(result.Value);

        return BadRequest(result.Error);
    }

    [HttpGet("{userId}/follow-list")]
    public async Task<ActionResult> GetFollowings(string userId, string predicate)
    {
        var result = await mediator.Send(
            new GetFollowings.Query { UserId = userId, Predicate = predicate }
        );

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess && result.Value != null)
            return Ok(result.Value);

        return BadRequest(result.Error);
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<UserProfile>> GetProfile(string userId)
    {
        var result = await mediator.Send(new GetProfile.Query { UserId = userId });

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess && result.Value != null)
            return Ok(result.Value);

        return BadRequest(result.Error);
    }

    [HttpPatch]
    public async Task<ActionResult> UpdateProfile([FromForm] UpdateProfile.Command command)
    {
        var result = await mediator.Send(command);

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess)
            return Ok();

        return BadRequest(result.Error);
    }

    [HttpGet("{userId}/events")]
    public async Task<ActionResult> GetEvents(string userId, ProfileEventType eventType)
    {
        var result = await mediator.Send(new GetEvents.Query() { UserId = userId, EventType = eventType });

        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        if (result.IsSuccess && result.Value != null)
            return Ok(result.Value);

        return BadRequest(result.Error);
    }
}
