
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.Product.Public;
using SWPSolution.ViewModels.Common;

namespace SWPSolution.Application.Catalog.Product
{
    public interface IPublicProductService
    {
        Task<PageResult<ProductViewModel>> GetAllByCategoryId(GetProductPagingRequest request);
    }
}
