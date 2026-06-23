using Application.Profiles.Commands;
using Application.Profiles.DTOs;
using Application.Profiles.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController(IMediator mediator) : BaseApiController
{
    /// <summary>GET /api/profiles/{username}</summary>
    [AllowAnonymous]
    [HttpGet("{username}")]
    public async Task<ActionResult<ProfileDto>> GetProfile(string username)
    {
        var currentUsername = User.Identity?.Name ?? string.Empty;

        var result = await mediator.Send(new GetProfile.Query
        {
            Username        = username,
            CurrentUsername = currentUsername,
        });

        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess && result.Value != null) return result.Value;

        return BadRequest(result.Error);
    }

    /// <summary>
    /// GET /api/profiles/{username}/events?predicate=future|past|hosting
    /// </summary>
    [AllowAnonymous]
    [HttpGet("{username}/events")]
    public async Task<ActionResult<List<UserEventDto>>> GetUserEvents(
        string username, [FromQuery] string predicate = "future")
    {
        var result = await mediator.Send(new GetUserEvents.Query
        {
            Username  = username,
            Predicate = predicate,
        });

        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess && result.Value != null) return result.Value;

        return BadRequest(result.Error);
    }

    /// <summary>
    /// GET /api/profiles/{username}/followings?predicate=followers|following
    /// </summary>
    [AllowAnonymous]
    [HttpGet("{username}/followings")]
    public async Task<ActionResult<List<FollowerDto>>> GetFollowings(
        string username, [FromQuery] string predicate = "following")
    {
        var result = await mediator.Send(new GetFollowings.Query
        {
            Username  = username,
            Predicate = predicate,
        });

        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess && result.Value != null) return result.Value;

        return BadRequest(result.Error);
    }

    /// <summary>PUT /api/profiles — update own profile</summary>
    [HttpPut]
    public async Task<ActionResult> UpdateProfile(UpdateProfile.Command command)
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();

        command.Username = username;

        var result = await mediator.Send(command);

        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess) return Ok();

        return BadRequest(result.Error);
    }

    /// <summary>POST /api/profiles/{username}/follow — toggle follow/unfollow</summary>
    [HttpPost("{username}/follow")]
    public async Task<ActionResult> ToggleFollow(string username)
    {
        var observerUsername = User.Identity?.Name;
        if (observerUsername == null) return Unauthorized();

        var result = await mediator.Send(new ToggleFollow.Command
        {
            ObserverUsername = observerUsername,
            TargetUsername   = username,
        });

        if (!result.IsSuccess && result.Code == 400) return BadRequest(result.Error);
        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess) return Ok();

        return BadRequest(result.Error);
    }
}