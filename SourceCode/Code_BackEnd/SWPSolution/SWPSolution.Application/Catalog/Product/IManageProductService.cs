using Microsoft.AspNetCore.Http;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.ProductImage;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.Application.Catalog.Product
{
    public interface IManageProductService
    {
        Task<string> Create(ProductCreateRequest request);

        Task<List<string>> CreateMultipleProducts(List<ListProductCreateRequest> requests);


        Task<int> Update(ProductUpdateRequest request);

        Task<int> Delete(string productId);

        Task<ProductViewModel> GetById(string productId);

        Task<bool> UpdatePrice(string productId, float newPrice);

        Task<bool> UpdateQuantity(int productId, int addedQuantity);

        Task<int> AddImage(string productId, ProductImageCreateRequest request);

        Task<int> AddMultipleImages(string productId, List<ProductImageCreateRequest> requests);

        Task<int> RemoveImage(string imageId);

        Task<int> UpdateImage(string imageId, ProductImageUpdateRequest request);

        Task<ProductImageViewModel> GetImageById(int imageId);
        
        Task<List<ProductImageViewModel>> GetListImages(string productId);

        Task<PageResult<ProductViewModel>> GetAllPagning(GetManageProductPagingRequest request);

        Task<bool> AddReview(string memberId, AddReviewRequest request);

        Task<List<ReviewVM>> GetReviewsByMemberId(string memberId);

        Task<List<ReviewVM>> GetReviewsByProductId(string productId);

        Task<List<ReviewVM>> GetReviewsByMemberIdAndProductId(string memberId, string productId);

        Task<List<ReviewVM>> GetAllReview();

        Task<bool> DeleteReview(string memberId, string productId);

        Task<string> ExtractMemberIdFromTokenAsync(string token);
    }
}
