using Microsoft.AspNetCore.Http;

namespace Application.Events.DTOs
{
    /// <summary>
    /// DTO for creating a new event — contains only the fields
    /// the client is allowed to provide. Server-managed fields
    /// like Id and CreatedAt are intentionally excluded.
    /// Image is optional — an event can be created without a photo.
    /// </summary>
    public class CreateEventDto : BaseEventDto
    {
        public IFormFile? Image { get; set; }
    }
}