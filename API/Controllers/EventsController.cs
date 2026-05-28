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

    [HttpGet("{id}")]
    public async Task<ActionResult<Domain.Event>> GetEvent(string id)
    {
        return await mediator.Send(new GetEventDetails.Query { Id = id });
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
