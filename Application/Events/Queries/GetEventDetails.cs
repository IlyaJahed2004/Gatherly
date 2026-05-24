using System;
using System.Diagnostics;
using Domain;
using MediatR;
using Persistence;

namespace Application.Events.Queries
{
    public class GetEventDetails
    {
        public class Query : IRequest<Event>
        {
            public required string Id { get; set; }
        }

        public class Handler(GatherlyDbContext context) : IRequestHandler<Query, Event>
        {
            public async Task<Event> Handle(Query request, CancellationToken cancellationToken)
            {
                var specificevent = await context.Events.FindAsync([request.Id], cancellationToken);
                if (specificevent == null)
                    throw new Exception("Activity not found");
                return specificevent;
            }
        }
    }
}
