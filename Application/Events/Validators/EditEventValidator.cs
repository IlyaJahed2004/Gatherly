using Application.Events.Commands;
using Application.Events.DTOs;
using FluentValidation;

namespace Application.Events.Validators;

public class EditEventValidator : BaseEventValidator<UpdateEvent.Command, EditEventDto>
{
    public EditEventValidator()
        : base(x => x.EventDto)
    {
        RuleFor(x => x.EventDto.Id).NotEmpty().WithMessage("Id is required.");
    }
}
