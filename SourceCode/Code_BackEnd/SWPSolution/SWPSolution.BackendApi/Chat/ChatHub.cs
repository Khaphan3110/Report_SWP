using Microsoft.AspNetCore.SignalR;
using SWPSolution.Data.Entities;
using System.Threading.Tasks;

namespace SWPSolution.BackendApi.Chat;

public class ChatHub : Hub
{
    public async Task JoinRoom(Member member)
    {
        
    }
}