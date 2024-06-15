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
    public interface IOrderService
    {
        Task<Order> CreateOrder(OrderRequest orderRequest);
        Task<Order> GetOrderById(string orderId);
        IEnumerable<Order> GetOrdersByMemberId(string memberId);
        Task<string> UpdateOrderStatus(string orderId, OrderStatus newStatus);
        Task<string> ExtractMemberIdFromTokenAsync(string token);
        Task<bool> PlaceOrderAsync(OrderRequest orderRequest);
    }
}
