using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SobujEnterprise.Infrastructure.Hubs
{
    public class OrderNotificationHub : Hub
    {
        public async Task JoinAdminGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "AdminOrdersGroup");
        }

        public async Task LeaveAdminGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "AdminOrdersGroup");
        }
    }
}

