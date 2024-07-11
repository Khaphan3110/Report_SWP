using Microsoft.AspNetCore.Http;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.Sales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Sales
{
    public interface IPreOrderService
    {
        Task<IEnumerable<PreOrder>> GetDepositedPreOrdersAsync();
        Task<bool> IsProductAvailable(string productId, int quantity);
        Task<PreOrder> CreatePreOrder(CreatePreOrderRequest model);
        Task<List<PreOrder>> GetAll();
        Task<Payment> ProcessPreOrderDeposit(string preorderId, double orderTotal);
        Task NotifyCustomer(string memberId, PreOrder preorder, string paymentUrl);
        Task UpdateOrderStatus(string preorderId, PreOrderStatus newStatus);
        Task<PreOrder> GetPreOrder(string preorderId);
        PageResult<PreOrderVM> GetPreOrdersPaging(PreOrderPagingRequest request);
        Task SendReceiptEmailAsync(string memberId, PreOrder preorder);
        Task<string> CheckPreOrderAsync(string preorderId);
        Task<string> GeneratePaymentUrlAndNotifyAsync(string preorderId, HttpContext httpContext);
    }
}
