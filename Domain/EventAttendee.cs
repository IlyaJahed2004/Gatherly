using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class EventAttendee
    {
        public string? UserId { get; set; } // FK → User
        public User User { get; set; } = null!; // navigation to User

        public string? EventId { get; set; } // FK → Event
        public Event Event { get; set; } = null!; // navigation to Event

        public bool IsHost { get; set; } // extra data about the relationship
        public DateTime DateJoined { get; set; } // extra data about the relationship
    }
}
