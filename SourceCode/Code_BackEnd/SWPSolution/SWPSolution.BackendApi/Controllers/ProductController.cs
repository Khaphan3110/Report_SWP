using System.Drawing.Text;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.Catalog.Product;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.ProductImage;

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
            var products = await _publicProductService.GetAllByCategoryId(request);
            return Ok(products);
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

        [HttpDelete("{productId}")]
        public async Task<IActionResult> Delete(string productId)

        {
            var affectedResult = await _manageProductService.Delete(productId);
            if (affectedResult == 0)
                return BadRequest();

            return Ok();
        }

        [HttpPatch  ("price/{id}/{newPrice}")]
        public async Task<IActionResult> UpdatePrice([FromQuery]string id, float newPrice)


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
    }
}
