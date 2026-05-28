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
        RuleFor(x => x.EventDto.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title must not exceed 100 characters.");

        // Validates the Description inside the nested EventDto
        RuleFor(x => x.EventDto.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("EventDescription must not exceed 2000 characters.");

        // Validates the StartDate inside the nested EventDto
        RuleFor(x => x.EventDto.StartDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("Date must be in the future");

        // Validates the Category inside the nested EventDto
        RuleFor(x => x.EventDto.Category)
            .NotEmpty().WithMessage("Category is required");

        // Validates the City inside the nested EventDto
        RuleFor(x => x.EventDto.City)
            .NotEmpty().WithMessage("City is required");

        // Validates the Venue inside the nested EventDto
        RuleFor(x => x.EventDto.Venue)
            .NotEmpty().WithMessage("Venue is required");

        // Validates the Latitude inside the nested EventDto
        RuleFor(x => x.EventDto.Latitude)
            .NotEmpty().WithMessage("Latitude is required")
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90");

        // Validates the Longitude inside the nested EventDto
        RuleFor(x => x.EventDto.Longitude)
            .NotEmpty().WithMessage("Longitude is required")
            .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180");
    }
}
