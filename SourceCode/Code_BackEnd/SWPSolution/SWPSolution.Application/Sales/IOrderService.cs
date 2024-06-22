using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Sales
{
    public interface IOrderService
    {
        Task<string> ExtractMemberIdFromTokenAsync(string token);
        Task<bool> PlaceOrderAsync(OrderRequest orderRequest);
        Task<bool> AddReview(string memberId, AddReviewRequest request);
        Task<bool> DeleteReview(string memberId, string productId);
    }
}
