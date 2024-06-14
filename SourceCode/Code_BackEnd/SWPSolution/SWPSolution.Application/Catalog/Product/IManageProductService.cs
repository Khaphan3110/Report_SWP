using Microsoft.AspNetCore.Http;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.ProductImage;
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

        Task<int> AddImage(string productId, ProductImageCreateRequest request);

        Task<int> RemoveImage(string imageId);

        Task<int> UpdateImage(string imageId, ProductImageUpdateRequest request);

        Task<ProductImageViewModel> GetImageById(int imageId);
        
        Task<List<ProductImageViewModel>> GetListImages(string productId);

        Task<PageResult<ProductViewModel>> GetAllPagning(GetManageProductPagingRequest request);
    }
}
