using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.System.User
{
    public interface ITokenService
    {
        string CreateToken(Member user, Roles role);
    }
}
