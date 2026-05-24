using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events.Queries
{
    /// <summary>
    /// Container class that encapsulates the CQRS Query definition
    /// and its corresponding execution Handler for retrieving all events.
    /// </summary>
    public class GetEventList
    {
        // 1. THE CQRS QUERY (The Read Message Contract)
        // Implements 'IRequest<TResponse>' to define this class as a MediatR message.
        // It holds no behavior or state, serving purely as a data transfer contract.
        // The generic argument specifies that the mediator must return a 'List<Domain.Event>' upon execution.
        public class Query : IRequest<List<Domain.Event>> { }

        // 2. THE CQRS HANDLER (The Use Case Processor)
        // Implements 'IRequestHandler<TRequest, TResponse>' to register this class as the executor for the Query.
        // - 'Query': Specifies the exact incoming message type this handler is bound to.
        // - 'List<Domain.Event>': Represents the explicit return type, matching the Query's contract.
        // The 'GatherlyDbContext' infrastructure dependency is injected via the primary constructor.
        public class Handler(GatherlyDbContext context) : IRequestHandler<Query, List<Domain.Event>>
        {
            // 3. THE HANDLER EXECUTION METHOD
            // Automatically invoked by the MediatR pipeline when 'IMediator.Send()' dispatches the Query.
            // - 'request': The captured query instance containing request parameters (empty in this context).
            // - 'cancellationToken': Propagates notification that the network request or operation should be aborted.
            public async Task<List<Event>> Handle(
                Query request,
                CancellationToken cancellationToken
            )
            {
                // Executes an asynchronous, non-blocking fetch operation against the database infrastructure.
                // The API controller remains completely decoupled from this underlying EF Core data access logic.
                return await context.Events.ToListAsync(cancellationToken);
            }
        }
    }
}
