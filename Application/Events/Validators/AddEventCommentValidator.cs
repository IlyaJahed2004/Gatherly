using Application.Events.Commands;
using FluentValidation;

namespace Application.Events.Validators;

// Validates AddEventComment.Command before the handler runs — picked up
// automatically by the ValidationBehavior pipeline (see Application/Core).
public class AddEventCommentValidator : AbstractValidator<AddEventComment.Command>
{
    public AddEventCommentValidator()
    {
        RuleFor(x => x.Message).NotEmpty().MaximumLength(1000);
    }
}