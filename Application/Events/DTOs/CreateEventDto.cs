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
    public class CreateEventDto : BaseEventDto { }
}
