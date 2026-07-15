namespace Application.Events.DTOs;

/// <summary>
/// Shape returned for a single event comment.
/// Mirrors the frontend's EventComment interface (client-app/src/components/EventChat)
/// so the client can wire up loadComments/postComment without any field renaming.
/// </summary>
public class EventCommentDto
{
    public required string Id { get; set; }
    public required string EventId { get; set; }
    public required string AuthorId { get; set; }
    public required string AuthorName { get; set; }
    public string? AuthorImageUrl { get; set; }
    public required string Message { get; set; }
    public DateTime CreatedAt { get; set; }
}