using Application.Events.Commands;
using Application.Events.DTOs;
using FluentValidation;

namespace Application.Events.Validators;

// Validates the CreateEvent.Command before the handler runs.
// AbstractValidator<T> — T is what we are validating (the Command itself).
public class CreateEventValidator : BaseEventValidator<CreateEvent.Command, CreateEventDto>
{
    public CreateEventValidator() : base(x => x.EventDto)
    {

    }
}
