using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        //identity will enforce password rules (min length, complexity) by default, so we don't need to add extra validation here.
        public string Password { get; set; } = "";
    }
}
