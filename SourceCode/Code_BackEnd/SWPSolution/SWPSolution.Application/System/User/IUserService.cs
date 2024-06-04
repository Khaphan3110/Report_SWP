
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

        Task<bool> SendOtp(string email);


        Task<bool> TestEmail(string emailAddress);

    }
}
