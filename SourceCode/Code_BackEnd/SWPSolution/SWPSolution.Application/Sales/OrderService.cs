using SWPSolution.ViewModels.Sales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Sales
{
    public class OrderService : IOrderService
    {
        public Task<string> ExtractMemberIdFromTokenAsync(string token)
        {
            throw new NotImplementedException();
        }

        public Task<bool> PlaceOrderAsync(OrderRequest orderRequest)
        {
            throw new NotImplementedException();
        }
    }
}
