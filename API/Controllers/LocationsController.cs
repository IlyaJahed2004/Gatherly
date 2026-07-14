using Application.Locations.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LocationsController(IMediator mediator) : BaseApiController
{
    [HttpGet("geocode")]
    public async Task<IActionResult> Geocode([FromQuery] string city)
    {
        var result = await mediator.Send(new GetGeocode.Query
        {
            City = city
        });

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Error, errors = result.Errors });
        }

        return Ok(result.Value);
    }
}

