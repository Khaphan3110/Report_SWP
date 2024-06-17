using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.AdminApp.Services
{
    public interface IUserApiClient
    {
        public Task<string> Authenticate(LoginRequest request);

    }
}
