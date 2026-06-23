using Application.Core;
using Application.Events.Commands;
using Application.Events.DTOs;
using Application.Events.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class EventsController(IMediator mediator) : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<PagedList<Event>>> GetEvents(
        [FromQuery] GetEventsParams getEventsParams)
    {
        var result = await mediator.Send(new GetEventList.Query { Params = getEventsParams });
        return Ok(result.Value);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<EventDetailsDto>> GetEvent(string id)
    {
        var result = await mediator.Send(new GetEventDetails.Query { Id = id });

        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess && result.Value != null)  return result.Value;

        return BadRequest(result.Error);
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateEvent(CreateEventDto newEventDto)
    {
        var result = await mediator.Send(new CreateEvent.Command { EventDto = newEventDto });

        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess && result.Value != null)  return result.Value;

        return BadRequest(result.Error);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateEvent(EditEventDto newEvent)
    {
        var result = await mediator.Send(new UpdateEvent.Command { EventDto = newEvent });

        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess && result.Value != null)  return Ok(result.Value);

        return BadRequest(result.Error);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEvent(string id)
    {
        var result = await mediator.Send(new DeleteEvent.Command { Id = id });

        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess && result.Value != null)  return Ok(result.Value);

        return BadRequest(result.Error);
    }


    [HttpPost("{id}/attend")]
    public async Task<ActionResult> UpdateAttendance(string id)
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();

        var result = await mediator.Send(new UpdateAttendance.Command
        {
            EventId  = id,
            Username = username,
        });

        if (!result.IsSuccess && result.Code == 401) return Unauthorized();
        if (!result.IsSuccess && result.Code == 404) return NotFound();
        if (result.IsSuccess) return Ok();

        return BadRequest(result.Error);
    }
}