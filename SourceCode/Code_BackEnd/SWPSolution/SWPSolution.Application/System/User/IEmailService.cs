using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.Application.System.User
{
    public interface IEmailService
    {
        void SendEmail(MessageVM message);
    }
}
