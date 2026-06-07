using Application.Core;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace API.Middleware;

/// <summary>
/// Global exception handling middleware.
/// Sits at the outermost layer of the HTTP pipeline — registered first in Program.cs —
/// so it wraps every subsequent middleware, controller, and MediatR pipeline call
/// in a try/catch, intercepting all unhandled exceptions before they reach the client.
///
/// Converts known exceptions (e.g. FluentValidation.ValidationException) into
/// structured, appropriate HTTP responses instead of raw 500 errors.
/// </summary>
public class ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, IHostEnvironment env) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            // Pass the request down the pipeline
            await next(context);
        }
        catch (ValidationException ex)
        {
            // Thrown by ValidationBehavior when FluentValidation rules fail.
            // Convert to 400 Bad Request with structured error body.
            await HandleValidationException(context, ex);
        }
        catch (Exception ex)
        {
            // Catch-all for unexpected exceptions.
            // Logs to console for now — can be extended to a proper logger.
            //Console.WriteLine(ex);

            await HandleException(context, ex);
        }
    }

    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        //Specify which environment we are running at
        var response = env.IsDevelopment() ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace)
            : new AppException(context.Response.StatusCode, ex.Message, null);

        //How to show the AppException we made from the founded error 
        var options  = new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
    }

    /// <summary>
    /// Converts a FluentValidation.ValidationException into a structured
    /// 400 Bad Request response using ASP.NET Core's ValidationProblemDetails format.
    ///
    /// Groups errors by property name so the client receives a clean map of
    /// which fields failed and why.
    /// Example response body:
    /// {
    ///   "title": "Validation error",
    ///   "status": 400,
    ///   "errors": {
    ///     "EventDto.Title": ["Title is required"],
    ///     "EventDto.Description": ["Description is required"]
    ///   }
    /// }
    /// </summary>
    private async Task HandleValidationException(HttpContext context, ValidationException ex)
    {
        // Dictionary of propertyName → [error messages].
        // string[] because multiple rules can fail on the same property.
        // e.g. "EventDto.Title": ["Title is required", "Title is too short"]
        var validationErrors = new Dictionary<string, string[]>();

        if (ex.Errors is not null)
        {
            foreach (var error in ex.Errors)
            {
                // TryGetValue does two things in one call:
                // 1. checks if this property already has errors in the dictionary
                // 2. if yes, writes the existing string[] into existingErrors via 'out'
                // This avoids a double dictionary lookup (ContainsKey + then indexer).
                if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors))
                {
                    // Property already has at least one error — append the new message
                    // to the existing array rather than overwriting it.
                    validationErrors[error.PropertyName] = existingErrors
                        .Append(error.ErrorMessage)
                        .ToArray();
                }
                else
                {
                    // First error seen for this property — create a new entry
                    validationErrors[error.PropertyName] = new[] { error.ErrorMessage };
                }
            }
        }

        context.Response.StatusCode = StatusCodes.Status400BadRequest;

        // ValidationProblemDetails is ASP.NET Core's standard contract for validation error responses.
        // We pass validationErrors (our Dictionary<string, string[]>) into the constructor
        // so it populates the 'errors' field in the response body — telling the client
        // exactly which fields failed and why.
        // Without this, the client would get a 400 but with no field-level detail.
        var validationProblemDetails = new ValidationProblemDetails(validationErrors)
        {
            Status = StatusCodes.Status400BadRequest,
            Type = "ValidationFailure",
            Title = "Validation error",
            Detail = "One or more validation errors has occurred",
        };

        await context.Response.WriteAsJsonAsync(validationProblemDetails);
    }
}
