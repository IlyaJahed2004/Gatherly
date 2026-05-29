namespace Application.Core;

public class GetEventsParams
{
    private const int MaxPageSize = 50;

    public int PageNumber { get; set; } = 1;

    private int _pageSize = 5;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : (value < 1 ? 1 : value);
    }

    public DateTime? StartDate { get; set; }
    public EventCategoryParam Category { get; set; } = EventCategoryParam.None;
}

public enum EventCategoryParam
{
    None = 0,
    Sports = 1,
    Science = 2,
    Leisure = 3,
    Other = 4
}
