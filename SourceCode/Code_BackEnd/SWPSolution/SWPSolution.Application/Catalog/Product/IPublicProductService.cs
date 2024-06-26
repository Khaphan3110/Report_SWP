
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Common;

namespace SWPSolution.Application.Catalog.Product
{
    public interface IPublicProductService
    {
<<<<<<< HEAD
        Task<PageResult<ProductViewModel>> GetAllPaging(GetPublicProductPagingRequest request);
       
=======
        Task<int> GetTotalProductCountAsync();

        Task<PageResult<ProductViewModel>> GetAllByCategoryId(GetPublicProductPagingRequest request);

>>>>>>> feature/preorder_controller
        Task<List<ProductViewModel>> GetAll();
    }
}
