using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.Promotion;

namespace SWPSolution.Application.Catalog.Promotion
{
    public interface IPromotionService
    {
        Task<string> Create(PromotionCreateRequest request);

        Task<List<string>> CreateMultiplePromotions(List<PromotionCreateRequest> requests);

        Task<bool> Update(string promotionId, PromotionUpdateRequest request);

        Task<bool> Delete(string promotionId);

        Task<PromotionVM> GetById(string productId);

        Task<List<PromotionVM>> GetByName(string search);

        Task<List<PromotionVM>> GetAll();
        Task<int?> GetDiscountValueByPromotionId(string promotionId);
    }
}
