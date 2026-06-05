using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // based on the baseapicontroller , the route will be api/account
    public class AccountController(SignInManager<User> signInManager) : BaseApiController //when we access to signin manager ,we access usermanager too
    {
        [AllowAnonymous] // This endpoint is public and does not require authentication.
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email, // Identity uses UserName for login, so we set it to the email.
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
                return Ok();

            foreach (var error in result.Errors)
                ModelState.AddModelError(error.Code, error.Description);

            return ValidationProblem();
        }
    }
}
