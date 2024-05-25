using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EShopBusinessObject;
using EShopDAOs;
using EShopServices;
using static SWPSolution.API.Controllers.UsersController;

namespace SWPSolution.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService iUserService;

        public UsersController()
        {
            iUserService = new UserService();
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if(iUserService.GetUsers() == null)
            {
                return NotFound();
            }
            return iUserService.GetUsers().ToList();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if(iUserService.GetUsers() == null)
            {
                return NotFound();
            }
            var user = iUserService.GetUser(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            iUserService.UpdateUser(id, user);
            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
           
            if(iUserService.GetUsers == null)
            {
                return Problem("Entity set 'UserContext.Users' is null.");
            }
            iUserService.AddUser(user);

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (iUserService.GetUsers() == null)
            {
                return NotFound();
            }
            iUserService.DeleteUser(id);
            return NoContent();
        }
        public class LoginModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("login")]
        public ActionResult<string> Login([FromBody] LoginModel loginModel)
        {
            if (loginModel == null || string.IsNullOrEmpty(loginModel.Username) || string.IsNullOrEmpty(loginModel.Password))
            {
                return BadRequest("Invalid username or password.");
            }

            string response = iUserService.GetLogin(loginModel.Username, loginModel.Password);
            return response;
        }
    }
}
