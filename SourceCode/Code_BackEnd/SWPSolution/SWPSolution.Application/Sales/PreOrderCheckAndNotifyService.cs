using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SWPSolution.Application.Sales;

public class PreOrderCheckAndNotifyService : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Adjust as needed

    public PreOrderCheckAndNotifyService(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAndNotifyPreOrders();
            await Task.Delay(_checkInterval, stoppingToken);
        }
    }

    private async Task CheckAndNotifyPreOrders()
    {
        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var preOrderService = scope.ServiceProvider.GetRequiredService<IPreOrderService>();

            var preOrders = await preOrderService.GetDepositedPreOrdersAsync();

            foreach (var preorder in preOrders)
            {
                var checkResult = await preOrderService.CheckPreOrderAsync(preorder.PreorderId);

                if (checkResult == "Deposited")
                {
                    // Since background service doesn't have HttpContext, it cannot call GeneratePaymentUrlAndNotifyAsync
                    // Send a notification to admin or log it, and let the admin trigger the notification manually
                }
            }
        }
    }
}
