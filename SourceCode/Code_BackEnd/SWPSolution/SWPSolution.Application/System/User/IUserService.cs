﻿
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.System.User
{
    public interface IUserService
    {
        Task<string> Authencate(LoginRequest request);

        Task<bool> Register(RegisterRequest request);

       // Task<bool> ForgotPassword([Required]string email);

        Task<bool> ConfirmEmail(string token, string email);

        Task<bool> TestEmail(string emailAddress);

        Task<List<MemberInfoVM>> GetAllMembersAsync();

        Task<MemberInfoVM> GetMemberByIdAsync(string memberId);

        Task<bool> UpdateMemberAsync(string memberId, UpdateMemberRequest request);

        Task<MemberAddressVM> GetMemberAddressByIdAsync(string memberId);

        Task<bool> UpdateMemberAddressAsync(string memberId, UpdateAddressRequest request);

        Task<bool> AddMemberAddressAsync(string memberId, AddAddressRequest request);

        Task<bool> DeleteUserAsync(string memberId);

        Task<bool> DeleteMemberAddressAsync(string id);
    }
}
