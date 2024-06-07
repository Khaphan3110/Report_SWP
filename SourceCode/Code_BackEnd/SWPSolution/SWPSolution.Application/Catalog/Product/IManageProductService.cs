using Microsoft.AspNetCore.Http;
using SWPSolution.ViewModels.Catalog.Categories;
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

        
        Task<PageResult<ProductViewModel>> GetAllPagning(GetManageProductPagingRequest request);

        Task<string> AddImage(string productId, ProductImageCreateRequest request);

        Task<int> RemoveImage(string productId, int imageId);

        Task<int> UpdateImage(string productId, int imageId, ProductImageUpdateRequest request);

     //   Task<List<ProductImageViewModel>> GetListImage(string productId);
    }
}
