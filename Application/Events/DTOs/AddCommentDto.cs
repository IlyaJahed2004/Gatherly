namespace Application.Events.DTOs;

/// <summary>
/// DTO for posting a new comment — contains only the field the client is
/// allowed to provide. Author and timestamp are always server-derived.
/// </summary>
public class AddCommentDto
{
    public required string Message { get; set; }
}