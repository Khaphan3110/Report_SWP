using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Catalog.Categories;
using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static SWPSolution.Application.Sales.OrderService;

namespace SWPSolution.Application.Sales
{
    public interface IOrderService
    {
        Task<Order> CreateOrder(OrderRequest orderRequest);
        Task<List<Order>> GetAll();
        Task<OrderVM> GetOrderById(string orderId);
        IEnumerable<Order> GetOrdersByMemberId(string memberId);
        Task<string> UpdateOrderStatus(string orderId, OrderStatus newStatus);
        Task<string> ExtractMemberIdFromTokenAsync(string token);
       Task<PlaceOrderResult> PlaceOrderAsync(OrderRequest orderRequest);
    }
}
