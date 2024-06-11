using Microsoft.AspNetCore.Http;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Common;

namespace SWPSolution.Application.Catalog.Product
{
    public interface IManageProductService
    {
        Task<string> Create(ProductCreateRequest request);

        Task<int> Update(ProductUpdateRequest request);

        Task<int> Delete(string productId);

        Task<ProductViewModel> GetById(string productId);

        Task<bool> UpdatePrice(string productId, float newPrice);

        Task<bool> UpdateQuantity(int productId, int addedQuantity);

        Task<string> AddImages(string productId, List<FormFile> files);

        Task<int> RemoveImages(string imageId, List<FormFile> files);

        Task<int> UpdateImages(string imageId, string caption);
       // Task<List<ProductImageViewModel>> GetListImage(int productId);
        Task<PageResult<ProductViewModel>> GetAllPagning(GetManageProductPagingRequest request);
    }
}
