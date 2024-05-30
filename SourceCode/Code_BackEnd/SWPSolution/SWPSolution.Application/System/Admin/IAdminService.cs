using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.System.Admin
{
    public interface IAdminService
    {
        Task<bool> RegisterAdmin(RegisterRequest request);
    }
}
