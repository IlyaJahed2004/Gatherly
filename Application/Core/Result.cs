namespace Application.Core;

/// <summary>
/// Generic wrapper for operation outcomes in the Application layer.
/// Instead of throwing exceptions for expected failures (e.g. not found),
/// handlers return a Result<T> that explicitly carries either a success
/// value or a failure reason + HTTP status code.
///
/// T is the type of the value returned on success:
///   Result<string>       → CreateEvent returning a new Id
///   Result<Event>        → GetEventDetails returning an event
///   Result<List<Event>>  → GetEventList returning a list
///   Result<Unit>         → commands that return nothing (delete, update)
/// </summary>
public class Result<T>
{
    // Whether the operation succeeded or failed
    public bool IsSuccess { get; set; }

    // The actual return value — only populated on success, null on failure
    public T? Value { get; set; }

    // Human-readable error message — only populated on failure
    public string? Error { get; set; }

    // The HTTP status code to return — set by the handler, used by the controller
    // e.g. 404 for not found, 403 for forbidden, 400 for bad request
    public int Code { get; set; }

    /// <summary>
    /// Factory method for a successful result.
    /// The caller gets back the value they asked for.
    /// </summary>
    public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value };

    /// <summary>
    /// Factory method for a failed result.
    /// Carries the reason (error message) and the appropriate HTTP status code.
    /// The controller reads Code to decide which HTTP response to return.
    /// </summary>
    public static Result<T> Failure(string error, int code) =>
        new()
        {
            IsSuccess = false,
            Error = error,
            Code = code,
        };
}
