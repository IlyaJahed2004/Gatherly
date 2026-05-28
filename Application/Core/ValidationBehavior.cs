using FluentValidation;
using MediatR;

namespace Application.Core;

/// <summary>
/// MediatR pipeline behaviour that automatically runs FluentValidation
/// before ANY command or query handler executes.
///
/// Acts like a middleware in the MediatR pipeline — sits between the
/// dispatcher and the handler. Registered once in Program.cs via
/// AddOpenBehavior, it intercepts every Command and Query globally.
///
/// If no validator exists for the request type, it skips validation
/// and passes through immediately.
/// Lives in Application/Core/ alongside MappingProfiles.
/// </summary>
public class ValidationBehavior<TRequest, TResponse>(IValidator<TRequest>? validator = null)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        // If no validator is registered for this request type,
        // skip validation entirely and pass to the next step in the pipeline
        if (validator == null)
            return await next();

        // Run all validation rules defined for this request type
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        // If any rules failed, collect all errors and throw.
        // The Handler is never reached — pipeline stops here.
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        // All rules passed — invoke the next step (the actual Handler)
        return await next();
    }
}
