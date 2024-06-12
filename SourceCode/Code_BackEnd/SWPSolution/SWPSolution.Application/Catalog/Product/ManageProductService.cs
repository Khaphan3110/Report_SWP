using Microsoft.AspNetCore.Http;
using SWPSolution.Application.Common;
using SWPSolution.Data.Entities;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.ProductImage;
using SWPSolution.ViewModels.Common;
using System.Data.Entity;
using System.Net.Http.Headers;

namespace SWPSolution.Application.Catalog.Product
{
    public class ManageProductService : IManageProductService
    {
        private readonly SWPSolutionDBContext _context;
        private readonly IStorageService _storageService;
        public ManageProductService(SWPSolutionDBContext context, IStorageService storageService)
        {
            _context = context;
            _storageService = storageService;
        }

        public async Task<string> Create(ProductCreateRequest request)
        {
            var product = new Data.Entities.Product()
            {
                ProductId = "",
                CategoriesId = request.CategoryId,
                ProductName = request.ProductName,
                Quantity = request.Quantity,
                Price = request.Price,
                Description = request.Description,
                Image = request.ThumbnailImage.ToString()

            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            // Fetch the newly inserted product from the database
            var insertedProduct = _context.Products.FirstOrDefault(p => p.ProductName == request.ProductName && p.Quantity == request.Quantity && p.Price == request.Price && p.Description == request.Description);

            // Check if insertedProduct is null or ProductId is empty
            if (insertedProduct == null || string.IsNullOrEmpty(insertedProduct.ProductId))
            {
                throw new Exception("Failed to retrieve the newly inserted product from the database.");
            }
            //Save image
            if (request.ThumbnailImage != null)
            {
                var productId = insertedProduct.ProductId;

                var productImage = new ProductImage()
                {
                    ProductId = productId,
                    Caption = "Thumbnail image",
                    DateCreated = DateTime.Now,
                    FileSize = request.ThumbnailImage.Length,
                    ImagePath = await this.SaveFile(request.ThumbnailImage),
                    SortOrder = 1
                };

                _context.ProductImages.Add(productImage);
                await _context.SaveChangesAsync(); // Save changes for ProductImage entity
            }
            return insertedProduct.ProductId;
    }

            public async Task<int> Delete(string productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) throw new SWPException($"Cannot find product:{productId}");

            var images = _context.ProductImages.Where(i => i.ProductId == productId);
            foreach( var image in images) 
            { 
               await _storageService.DeleteFileAsync(image.ImagePath);
            }
           
            _context.Products.Remove(product);
            
            return await _context.SaveChangesAsync();
        }



        public async Task<PageResult<ProductViewModel>> GetAllPagning(GetManageProductPagingRequest request)
        {
            //1. Request Join
            var query = from p in _context.Products
                        join c in _context.Categories on p.CategoriesId equals c.CategoriesId
                        join r in _context.Reviews on p.ProductId equals r.ProductId
                        select new { p, r, c };
            //2. Filter
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(x => x.p.ProductName.Contains(request.Keyword));
            }
            if (request.CategoryIds.Count > 0)
            {
                query = query.Where(p => request.CategoryIds.Contains(p.c.CategoriesId));
            }
            //3. Paging
            int totalRow = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new ProductViewModel()
                {
                    CategoriesId = x.p.CategoriesId,
                    ProductName = x.p.ProductName,
                    Description = x.p.Description,
                    Price = x.p.Price,
                    Quantity = x.p.Quantity,
                }).ToListAsync();
            //4. Select and projection
            var pageResult = new PageResult<ProductViewModel>()
            {
                TotalRecord = totalRow,
                Items = data

            };
            return pageResult;
        }

<<<<<<< HEAD

=======
>>>>>>> 0b12b4dbed67dd702b6eb0c910472ad9af2f5de0

        public async Task<int> Update(ProductUpdateRequest request)
        {
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null) throw new SWPException($"Cannot find product with id: {request.ProductId}");


            product.ProductId = "";
            product.CategoriesId = request.CategoriesId;
            product.ProductName = request.ProductName;
            product.Description = request.Description;
            product.CategoriesId = request.CategoriesId;

            //Save image
            if (request.ThumbnailImage != null)
            {
                var thumbnailImage =await _context.ProductImages.FirstOrDefaultAsync(i => i.ProductId == request.ProductId);
                if (thumbnailImage != null)
                {
                    thumbnailImage.FileSize = request.ThumbnailImage.Length;
                    thumbnailImage.ImagePath = await this.SaveFile(request.ThumbnailImage);
                    _context.ProductImages.Update(thumbnailImage);
                }
            }
            return await _context.SaveChangesAsync();

        }

        public async Task<bool> UpdatePrice(string productId, float newPrice)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) throw new SWPException($"Cannot find product with id: {productId}");
            product.Price = newPrice;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateQuantity(int productId, int addedQuantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) throw new SWPException($"Cannot find product with id: {productId}");
            product.Quantity += addedQuantity;
            return await _context.SaveChangesAsync() > 0;
        }

        

        private async Task<string> SaveFile(IFormFile file)
        {
            var originalFilename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(originalFilename)}";
            await _storageService.SaveFileAsync(file.OpenReadStream(), fileName);
            return fileName;
        }


        // Images
        public async Task<int> AddImage(string productId, ProductImageCreateRequest request)
        {
            var productImage = new ProductImage()
            {
                Caption = request.Caption,
                DateCreated = DateTime.Now,
                SortOrder = request.SortOrder,
                ProductId = productId,
            };
            if(request.ImageFile != null)
            {
                productImage.ImagePath = await this.SaveFile (request.ImageFile);
                productImage.FileSize = request.ImageFile.Length;
            }
            _context.ProductImages.Add(productImage);
            await _context.SaveChangesAsync();
            return productImage.Id; 
        }

        //Task<ProductViewModel> GetById(string productId);
        public async Task<ProductViewModel> GetById(string productId)
        {
            var product = await _context.Products.FindAsync(productId);

            var productViewModel = new ProductViewModel()
            {
                ProductId = product.ProductId,
                Description = product.Description,
                Price = product.Price,
                ProductName = product.ProductName,
                Quantity = product.Quantity,
                CategoriesId = product.CategoriesId,
            };
            return productViewModel;
        }

        public async Task<List<ProductImageViewModel>> GetListImages(string productId)
        {
            return await _context.ProductImages.Where(x => x.ProductId == productId)
                .Select(i => new ProductImageViewModel()
            {
                Caption=i.Caption,
                DateCreated = i.DateCreated,
                FileSize = i.FileSize,
                Id = i.Id,
                ImagePath = i.ImagePath,
                ProductId = i.ProductId,
                SortOrder=i.SortOrder

            }).ToListAsync();
        }

        public async Task<int> RemoveImage(string imageId)
        {
            var productImage = await _context.ProductImages.FindAsync(imageId);
            if(productImage == null)
            {
                throw new SWPException($"Cannot find image with id {imageId} to remove ");
            }
            _context.ProductImages.Remove(productImage);
           return await _context.SaveChangesAsync();
        }
        public async Task<int> UpdateImage(string imageId, ProductImageUpdateRequest request)
        {
            var productImage =await _context.ProductImages.FindAsync(imageId);
            if(productImage == null)
            {
                throw new SWPException($"Cannot find an image with  id {imageId}");
            }
            if (request.ImageFile != null)
            {
                productImage.ImagePath = await this.SaveFile(request.ImageFile);
                productImage.FileSize = request.ImageFile.Length;
            }
            _context.ProductImages.Update(productImage);
            return await _context.SaveChangesAsync();
        }

        public async Task<ProductImageViewModel> GetImageById(int imageId)
        {
            var image = await _context.ProductImages.FindAsync(imageId);
            if (image == null)
                throw new SWPException($"Cannot find image with id {imageId}");
            var viewModel = new ProductImageViewModel()
            {
                Caption = image.Caption,
                DateCreated = image.DateCreated,
                FileSize = image.FileSize,
                Id = image.Id,
                ImagePath = image.ImagePath,
                ProductId = image.ProductId,
                SortOrder = image.SortOrder

            };
            return viewModel;
        }
    }
}
