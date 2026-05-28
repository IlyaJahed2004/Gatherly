using System;
using Application.Events.Commands;
using Application.Events.DTOs;
using Application.Events.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class EventsController(IMediator mediator) : BaseApiController
{
    /// <summary>
    /// Fetches all events from the system.
    /// </summary>
    /// <returns>An HTTP response containing the list of events.</returns>
    [HttpGet]
    public async Task<ActionResult<List<Event>>> GetEvents()
    {
        // 2. TRADITIONAL APPROACH (TIED TO INFRASTRUCTURE)
        // return await context.Events.ToListAsync();
        // In the old way, the API directly managed database queries, breaking Clean Architecture boundaries.

        // 3. MEDIATR PIPELINE APPROACH (MESSAGE-DRIVEN)
        // The controller now serves as a thin delivery mechanism.
        // It dispatches a contract message ('GetEventList.Query') into the MediatR pipeline.
        // This safely forwards execution to the Application layer without exposing HOW the data is retrieved.
        return await mediator.Send(new GetEventList.Query());
    }

    /// <summary>
    /// The controller's only job is to translate the Result into an HTTP response.
    /// All business decisions (found/not found) were made in the Application layer.
    /// The controller just reads the Result and maps it to the right status code.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetEvent(string id)
    {
        var result = await mediator.Send(new GetEventDetails.Query { Id = id });

        // Handler decided the event does not exist → 404 Not Found
        if (!result.IsSuccess && result.Code == 404)
            return NotFound();

        // Handler succeeded and returned a value → 200 OK with the event
        if (result.IsSuccess && result.Value != null)
            return result.Value;

        // Any other failure (unexpected) → 400 Bad Request with the error message
        return BadRequest(result.Error);
    }

    /// <summary>
    /// Creates a new event.
    /// Accepts a CreateEventDto from the client — NOT the full Event entity —
    /// to ensure only permitted fields are provided.
    /// Delegates all business logic to the Application layer via MediatR.
    /// </summary>
    /// <param name="newEventDto">The event data submitted by the client.</param>
    /// <returns>The Id of the newly created event.</returns>
    [HttpPost]
    public async Task<ActionResult<string>> CreateEvent(CreateEventDto newEventDto)
    {
        // Wrap the DTO in a MediatR Command and dispatch it.
        // The handler in the Application layer takes care of mapping,
        // persistence, and returning the new Id.
        return await mediator.Send(new CreateEvent.Command { EventDto = newEventDto });
    }

    [HttpPut]
    public async Task<ActionResult> UpdateEvent(Event newEvent)
    {
        await mediator.Send(new UpdateEvent.Command() { Event = newEvent });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEvent(string id)
    {
        await mediator.Send(new DeleteEvent.Command() { Id = id });
        return Ok();
    }
}
