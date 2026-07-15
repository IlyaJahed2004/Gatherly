using Application.Core;
using Application.Events.DTOs;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.Events.Commands;

public class AddEventComment
{
    public class Command : IRequest<Result<EventCommentDto>>
    {
        public required string EventId { get; set; }
        public required string Message { get; set; }
    }

    public class Handler(GatherlyDbContext dbContext, IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<EventCommentDto>>
    {
        public async Task<Result<EventCommentDto>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var targetEvent = await dbContext.Events.FindAsync(
                [request.EventId],
                cancellationToken
            );

            if (targetEvent == null)
                return Result<EventCommentDto>.Failure("Event not found", 404);

            var user = await userAccessor.GetUserAsync();

            var comment = new EventComment
            {
                EventId = targetEvent.Id,
                UserId = user.Id,
                Message = request.Message.Trim(),
            };

            dbContext.EventComments.Add(comment);

            var success = await dbContext.SaveChangesAsync(cancellationToken) > 0;

            if (!success)
                return Result<EventCommentDto>.Failure("Problem adding the comment", 400);

            // Built directly from the entity + already-loaded user — a round trip
            // through ProjectTo isn't needed for a single freshly-created row.
            return Result<EventCommentDto>.Success(
                new EventCommentDto
                {
                    Id = comment.Id,
                    EventId = comment.EventId,
                    AuthorId = user.Id,
                    AuthorName = user.DisplayName ?? user.UserName ?? "Unknown",
                    AuthorImageUrl = user.ImageUrl,
                    Message = comment.Message,
                    CreatedAt = comment.CreatedAt,
                }
            );
        }
    }
}