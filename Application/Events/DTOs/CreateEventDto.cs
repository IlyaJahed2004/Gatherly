using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Events.DTOs
{
    /// <summary>
    /// DTO for creating a new event — contains only the fields
    /// the client is allowed to provide. Server-managed fields
    /// like Id and CreatedAt are intentionally excluded.
    /// </summary>
    public class CreateEventDto
    {
        public string Title { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool isCancelled { get; set; }
        public string City { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
