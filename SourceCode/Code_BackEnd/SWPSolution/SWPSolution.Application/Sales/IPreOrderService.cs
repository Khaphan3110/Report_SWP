using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
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
        Task<bool> IsProductAvailable(string productId, int quantity);
        Task<PreOrder> CreatePreOrder(string productId, string memberId, int quantity);
        Task<Payment> ProcessPreOrderDeposit(string preorderId, double orderTotal);
        Task UpdateOrderStatus(string preorderId, OrderStatus newStatus);
        Task NotifyCustomer(string memberId, string subject, string message);
        Task<PreOrder> GetPreOrder(string preorderId);
    }
}
