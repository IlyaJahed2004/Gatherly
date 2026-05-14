using System;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class EventsController(GatherlyDbContext context) : BaseApiController
{
    // private readonly GatherlyDbContext Context;
    // public EventsController(GatherlyDbContext context)
    // {
    //     this.Context = context;
    // }

    [HttpGet]
    public async Task<ActionResult<List<Event>>> GetEvents()
    {
        // 1. Retrieve all Events from the database asynchronously.
        // 2. Convert the result to a List and return it as an HTTP response.
        return await context.Events.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Domain.Event>> GetEvent(string id)
    {
        // 1. Retrieve a single event by its unique identifier (id).
        // 2. If found, return the event; if not, return a 404 Not Found response.
        var specificevent = await context.Events.FindAsync(id);
        if (specificevent == null)
            return NotFound();
        return specificevent;
    }
}
