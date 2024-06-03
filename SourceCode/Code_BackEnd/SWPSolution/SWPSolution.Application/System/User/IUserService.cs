
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.System.User
{
    public interface IUserService
    {
        Task<string> Authencate(LoginRequest request);

        Task<bool> Register(RegisterRequest request);

       // Task<bool> ForgotPassword([Required]string email);

        Task<bool> ConfirmEmail(string otp);
<<<<<<< HEAD
=======
        Task<bool> SendOtp(string email);
>>>>>>> a10698748190bff25b31c3beefc383314d59336b

        Task<bool> TestEmail(string emailAddress);

    }
}
