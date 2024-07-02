using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.AdminApp.Services
{
    public interface IUserApiClient
    {
        public Task<string> Authenticate(LoginRequest request);

        Task<PageResult<UserVm>> GetUsersPagings(GetUserPagingRequest request);

        Task<ApiResult<UserVm>> GetById(Guid id);

	}
}
