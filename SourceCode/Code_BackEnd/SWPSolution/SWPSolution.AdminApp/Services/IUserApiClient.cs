using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.AdminApp.Services
{
    public interface IUserApiClient
    {
        public Task<string> Authenticate(LoginRequest request);
        public Task<PageResult<UserVm>> GetAllPaging(GetUserPagingRequest request);

    }
}
