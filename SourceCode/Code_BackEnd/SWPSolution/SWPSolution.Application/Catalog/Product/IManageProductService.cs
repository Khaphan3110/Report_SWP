using Microsoft.AspNetCore.Http;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Common;

namespace SWPSolution.Application.Catalog.Product
{
    public interface IManageProductService
    {
        Task<int> Create(ProductCreateRequest request);

        Task<int> Update(ProductUpdateRequest request);

        Task<int> Delete(string productId);

        Task<bool> UpdatePrice(int productId, float newPrice);

        Task<bool> UpdateQuantity(int productId, int addedQuantity);

        Task<int> AddImages(int productId, List<FormFile> files);

        Task<int> RemoveImages(string imageId, List<FormFile> files);

        Task<int> UpdateImages(string imageId, string caption);
        
        Task<List<ProductImageViewModel>> GetListImage(int productId);
        Task<PageResult<ProductViewModel>> GetAllPagning(GetManageProductPagingRequest request);
    }
}
