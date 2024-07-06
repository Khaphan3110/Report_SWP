using System.Drawing.Text;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.Catalog.Product;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.ProductImage;
using SWPSolution.ViewModels.System.Users;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class ProductController : Controller
    {
        private readonly IPublicProductService _publicProductService;
        private readonly IManageProductService _manageProductService;
        public ProductController(IPublicProductService publicProductService, IManageProductService manageProductService)
        {
            _publicProductService = publicProductService;
            _manageProductService = manageProductService;

        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products = await _publicProductService.GetAll();
            return Ok(products);
        }

        [HttpGet("public-paging")]
        public async Task<IActionResult> Get([FromQuery] GetPublicProductPagingRequest request)
        {
            var products = await _publicProductService.GetAllPaging(request);
            return Ok(products);
        }

        [HttpGet("get-total-product")]
        public async Task<ActionResult<int>> GetTotalProductCount()
        {
            var totalProducts = await _publicProductService.GetTotalProductCountAsync();
            return Ok(totalProducts);
        }

        [HttpGet("inventory-changes-week")]
        public IActionResult GetInventoryChangesForCurrentWeek()
        {
            var inventoryChanges = _manageProductService.GetInventoryChangesForCurrentWeek();
            return Ok(inventoryChanges);
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetById(string productId)
        {
            var products = await _manageProductService.GetById(productId);
            if (products == null)
            {
                return BadRequest("Cannot find product");
            }
            return Ok(products);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductCreateRequest request)

        {
            var productId = await _manageProductService.Create(request);
            if (productId.IsNullOrEmpty())
                return BadRequest();
            var product = await _manageProductService.GetById(productId);
            return CreatedAtAction(nameof(GetById), new { id = productId }, product);
        }
        [HttpPost("createmultiple")]
        public async Task<IActionResult> CreateMultiple([FromBody] List<ListProductCreateRequest> requests)
        {
            if (!ModelState.IsValid || requests == null || requests.Count == 0)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var productIds = await _manageProductService.CreateMultipleProducts(requests);

                if (productIds == null || productIds.Count == 0)
                {
                    return BadRequest("Failed to create any products.");
                }

                var products = new List<ProductViewModel>();
                foreach (var productId in productIds)
                {
                    var product = await _manageProductService.GetById(productId);
                    if (product != null)
                    {
                        products.Add(product);
                    }
                }

                if (products.Count == 0)
                {
                    return NotFound("No products found after creation.");
                }

                return CreatedAtAction(nameof(GetById), new { id = productIds }, products);
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to create products: {ex.Message}");
            }
        }

        [HttpPost("{productId}/uploadmultipleimages")]
        public async Task<IActionResult> UploadMultipleProductImages(string productId, List<IFormFile> imageFiles)
        {
            if (imageFiles == null || imageFiles.Count == 0)
            {
                return BadRequest("No images uploaded.");
            }

            var productImageRequests = imageFiles.Select(file => new ProductImageCreateRequest
            {
                ImageFile = file,
                Caption = "Uploaded Image",
                SortOrder = 1 // Set a default sort order or adjust as needed
            }).ToList();

            try
            {
                await _manageProductService.AddMultipleImages(productId, productImageRequests);

                return Ok("Images uploaded successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to upload images: {ex.Message}");
            }
        }
        [HttpPut]
        public async Task<IActionResult> Update([FromForm] ProductUpdateRequest request)

        {
            var affectedResult = await _manageProductService.Update(request);
            if (affectedResult == 0)
                return BadRequest();

            return Ok();
        }

        [HttpPut("update-quantity/{productId}")]
        public async Task<IActionResult> UpdateQuantity(string productId, [FromBody] UpdateQuantityRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _manageProductService.UpdateQuantity(productId, request);
                if (result > 0)
                {
                    return Ok(new { message = "Product quantity updated successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Failed to update product quantity" });
                }
            }
            catch (SWPException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

    [HttpDelete("{productId}")]
        public async Task<IActionResult> Delete(string productId)

        {
            var affectedResult = await _manageProductService.Delete(productId);
            if (affectedResult == 0)
                return BadRequest();

            return Ok();
        }

        [HttpPatch  ("price/{id}/{newPrice}")]
        public async Task<IActionResult> UpdatePrice(string id, float newPrice)


        {
            var isSuccessfull = await _manageProductService.UpdatePrice(id, newPrice);
            if (isSuccessfull)
                return Ok();

            return BadRequest();
        }

        //Images
        [HttpPost("{productId}/images")]
        public async Task<IActionResult> CreateImage(string productId, [FromForm] ProductImageCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var imageId = await _manageProductService.AddImage(productId,request);
            if(imageId == 0)
            {
                throw new SWPException("Cannot create images");
            }
            var image = await _manageProductService.GetImageById(imageId);

            return CreatedAtAction(nameof(GetImageById), new {id = imageId}, image);

        }
        [HttpPut("{productId}/images/{imageId}")]
        public async Task<IActionResult> UpdateImage(string imageId, [FromForm] ProductImageUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _manageProductService.UpdateImage(imageId, request);
            if (result == 0)
            {
                throw new SWPException("Cannot update images");
            }

            return Ok();

        }

        [HttpDelete("{productId}/images/{imageId}")]
        public async Task<IActionResult> RemoveImage(string imageId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _manageProductService.RemoveImage(imageId);
            if (result == 0)
            {
                throw new SWPException("Cannot remove images");
            }

            return Ok();

        }

        [HttpGet("{productId}/images/{imageId}")]
        public async Task<IActionResult> GetImageById(string productId, int imageId)
        {
            var image = await _manageProductService.GetImageById(imageId);
            if (image == null)
                return BadRequest("Cannot find image");
            return Ok(image);
        }

        [HttpGet("{productId}/images")]
        
        public async Task<ActionResult> GetImageByProductId(string productId)
        {
            var images = await _manageProductService.GetListImages(productId);

            if (images == null)
            {
                return NotFound();
            }

            return Ok(images);
        }

        [HttpPost("AddReview")]
        public async Task<IActionResult> AddReview([FromQuery] string jwtToken, [FromBody] AddReviewRequest request)
        {
            if (string.IsNullOrEmpty(jwtToken))
            {
                return BadRequest(new { message = "Token is required." });
            }

            try
            {
                var memberId = await _manageProductService.ExtractMemberIdFromTokenAsync(jwtToken);
                if (memberId == null)
                {
                    return BadRequest(new { message = "Invalid token." });
                }

                var result = await _manageProductService.AddReview(memberId, request);
                if (!result)
                {
                    return NotFound(new { message = "Member or Product not found" });
                }

                return Ok(new { message = "Review added successfully" });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetReviewsByMemberId")]
        public async Task<IActionResult> GetReviewsByMemberId([FromQuery] string jwtToken)
        {
            if (string.IsNullOrEmpty(jwtToken))
            {
                return BadRequest(new { message = "Token is required." });
            }

            try
            {
                var memberId = await _manageProductService.ExtractMemberIdFromTokenAsync(jwtToken);

                var review = await _manageProductService.GetReviewsByMemberId(memberId);
                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(review);
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetReviewsByProductId")]
        public async Task<IActionResult> GetReviewsByProductId([FromQuery] string productId)
        {
            if (string.IsNullOrEmpty(productId))
            {
                return BadRequest(new { message = "ProductId is required." });
            }

            try
            {
                var review = await _manageProductService.GetReviewsByProductId(productId);
                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(review);
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetReviewsByMemberIdAndProductId")]
        public async Task<IActionResult> GetReviewsByMemberIdAndProductId([FromQuery] string jwtToken, string productId)
        {
            if (string.IsNullOrEmpty(jwtToken))
            {
                return BadRequest(new { message = "Token is required." });
            }

            if (string.IsNullOrEmpty(productId))
            {
                return BadRequest(new { message = "ProductId is required." });
            }

            try
            {
                var memberId = await _manageProductService.ExtractMemberIdFromTokenAsync(jwtToken);

                var review = await _manageProductService.GetReviewsByMemberIdAndProductId(memberId, productId);
                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(review);
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("GetAllReview")]
        public async Task<IActionResult> GetAllReview()
        {
            var review = await _manageProductService.GetAllReview();
            return Ok(review);
        }

        [HttpDelete("DeleteReview")]
        public async Task<IActionResult> DeleteReview([FromQuery] string jwtToken, string productId)
        {
            if (string.IsNullOrEmpty(jwtToken))
            {
                return BadRequest(new { message = "Token is required." });
            }

            try
            {
                var memberId = await _manageProductService.ExtractMemberIdFromTokenAsync(jwtToken);

                var result = await _manageProductService.DeleteReview(memberId, productId);
                if (!result)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(new { message = "Review deleted successfully" });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
