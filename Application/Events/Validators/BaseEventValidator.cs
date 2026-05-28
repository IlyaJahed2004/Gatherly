using Application.Events.DTOs;
using FluentValidation;

namespace Application.Events.Validators;

public class BaseEventValidator<T, TDto> : AbstractValidator<T> where TDto : BaseEventDto
{
    public BaseEventValidator(Func<T, TDto> selector)
    {
        // Validates the Title inside the nested EventDto
        RuleFor(x => selector(x).Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title must not exceed 100 characters.");

        // Validates the Description inside the nested EventDto
        RuleFor(x => selector(x).Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("EventDescription must not exceed 2000 characters.");

        // Validates the StartDate inside the nested EventDto
        RuleFor(x => selector(x).StartDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("Date must be in the future");

        // Validates the Category inside the nested EventDto
        RuleFor(x => selector(x).Category)
            .NotEmpty().WithMessage("Category is required");

        // Validates the City inside the nested EventDto
        RuleFor(x => selector(x).City)
            .NotEmpty().WithMessage("City is required");

        // Validates the Venue inside the nested EventDto
        RuleFor(x => selector(x).Venue)
            .NotEmpty().WithMessage("Venue is required");

        // Validates the Latitude inside the nested EventDto
        RuleFor(x => selector(x).Latitude)
            .NotNull().WithMessage("Latitude is required")
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90");

        // Validates the Longitude inside the nested EventDto
        RuleFor(x => selector(x).Longitude)
            .NotNull().WithMessage("Longitude is required")
            .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180");
    }
}
