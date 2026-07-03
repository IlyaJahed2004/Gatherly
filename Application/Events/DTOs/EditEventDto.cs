using Microsoft.AspNetCore.Http;

namespace Application.Events.DTOs;

public class EditEventDto : BaseEventDto
{
    public IFormFile? Image { get; set; }
    public bool DeleteImage { get; set; }
}
