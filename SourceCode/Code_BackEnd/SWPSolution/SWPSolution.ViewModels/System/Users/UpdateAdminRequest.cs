using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.System.Users
{
    public class UpdateAdminRequest
    {
        public string Password { get; set; }
        public string Fullname { get; set; }   
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
