using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Gift;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Gift
{
    public interface IGiftService
    {
        Task<GiftPurchase> PurchaseGiftAsync(GiftPurchaseRequest request);
    }
}
