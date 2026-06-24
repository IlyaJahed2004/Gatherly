using Application.Profiles.Commands;
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
}
