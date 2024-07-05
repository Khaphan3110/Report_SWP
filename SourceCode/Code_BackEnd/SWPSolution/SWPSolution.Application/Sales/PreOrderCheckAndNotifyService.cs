using System;
using System.Data.Entity;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SWPSolution.Application.AppPayment;
using SWPSolution.Application.AppPayment.VNPay;
using SWPSolution.Application.Sales;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Payment;
using SWPSolution.ViewModels.System.Users;
using static Org.BouncyCastle.Math.EC.ECCurve;

public class PreOrderCheckAndNotifyService : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly IConfiguration _config;
    
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Adjust as needed

    public PreOrderCheckAndNotifyService(IServiceScopeFactory serviceScopeFactory, IConfiguration config)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _config = config;
        
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
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var vnPayService = scope.ServiceProvider.GetRequiredService<IVnPayService>();
            var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
            var preOrders = await preOrderService.GetDepositedPreOrdersAsync();
            var context = scope.ServiceProvider.GetRequiredService<SWPSolutionDBContext>();

            foreach (var preorder in preOrders)
            {
                
                var checkResult = await preOrderService.CheckPreOrderAsync(preorder.PreorderId);

                if (checkResult == "ReadyForPayment")
                {
                    var payment = context.Payments.FirstOrDefault(p => p.PreorderId == preorder.PreorderId);
                    var vnPayModel = new VnPaymentRequestModel
                    {
                        Amount = preorder.Price,
                        CreatedDate = DateTime.UtcNow,
                        Description = $"{preorder.MemberId}",
                        FullName = preorder.MemberId,
                        OrderId = preorder.PreorderId,
                        PaymentId = payment.PaymentId
                    };

                    var paymentUrl = vnPayService.CreatePaymentUrl(null, vnPayModel);
                    await NotifyCustomer(preorder.MemberId, preorder, paymentUrl, emailService);
                }
            }
        }
    }
    private async Task NotifyCustomer(string memberId, PreOrder preorder, string paymentUrl, IEmailService emailService)
    {
        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<SWPSolutionDBContext>();
            var member = await context.Members.FindAsync(memberId);
            if (member == null)
            {
                throw new InvalidOperationException("Member not found.");
            }
            var emailConfig = _config.GetSection("EmailConfiguration").Get<EmailVM>();
            var message = new MessageVM(
                new List<string> { member.Email }, // Pass recipient as a list
                "Your Preorder is Ready",
                $@"
                <h1>Your Preorder is Ready for Shipping</h1>
                <p>Thank you for your preorder!</p>
                <p>Preorder ID: {preorder.PreorderId}</p>
                <p>Total Amount: {preorder.Price}</p>
                <p>Please pay the remaining balance to complete your purchase.</p>
                <p><a href='{paymentUrl}'>Click here to pay the remaining amount</a></p>
                "
            );

             emailService.SendEmail(message);
        }
    }
}
