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
        Task<List<PreOrder>> GetAll();
        Task<Payment> ProcessPreOrderDeposit(string preorderId, double orderTotal);
        Task NotifyCustomer(string memberId, PreOrder preorder, string paymentUrl);
        Task UpdateOrderStatus(string preorderId, PreOrderStatus newStatus);
        Task<PreOrder> GetPreOrder(string preorderId);
    }
}
