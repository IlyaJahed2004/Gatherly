namespace Domain;

public class UserFollowing
{
    public string ObserverId { get; set; } = string.Empty;
    public User Observer { get; set; } = null!;

    public string TargetId { get; set; } = string.Empty;
    public User Target { get; set; } = null!;
}