using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.Product.Manage;
using SWPSolution.ViewModels.Common;

namespace SWPSolution.Application.Catalog.Product
{
    public interface IManageProductService
    {
        Task<int> Create(ProductCreateRequest request);

        Task<int> Update(ProductUpdateRequest request);

        Task<int> Delete(int productId);

        Task<bool> UpdatePrice(int productId, float newPrice);

        Task<bool> UpdateQuantity(int productId, int addedQuantity);

  

        Task<PageResult<ProductViewModel>> GetAllPagning(GetProductPagingRequest request);
    }
}
