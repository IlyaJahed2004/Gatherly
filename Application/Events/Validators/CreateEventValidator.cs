using Application.Events.Commands;
using FluentValidation;

namespace Application.Events.Validators;

// Validates the CreateEvent.Command before the handler runs.
// AbstractValidator<T> — T is what we are validating (the Command itself).
public class CreateEventValidator : AbstractValidator<CreateEvent.Command>
{
    public CreateEventValidator()
    {
        // Validates the Title inside the nested EventDto
        RuleFor(x => x.EventDto.Title).NotEmpty().WithMessage("Title is required");

        // Validates the Description inside the nested EventDto
        RuleFor(x => x.EventDto.Description).NotEmpty().WithMessage("Description is required");
    }
}
