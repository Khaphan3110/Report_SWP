using Microsoft.AspNetCore.Http;
using SWPSolution.Application.Common;
using SWPSolution.Data.Entities;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.Product.Manage;
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
        public async Task<int> Create(ProductCreateRequest request)
        {
            var product = new Data.Entities.Product
            {
                ProductName = request.ProductName,
                Quantity = request.Quantity,
                Price = request.Price,
                Description = request.Description,

            };
            //Save image
            if(request.ThumbnailImage != null )
            {
                product.ProductImages = new List<ProductImage>()
                {
                    new ProductImage()
                    {
                        Caption = "Thumbnail image",
                        DateCreated = DateTime.Now,
                        FileSize = request.ThumbnailImage.Length,
                        ImagePath =await this.SaveFile(request.ThumbnailImage),
                        SortOrder = 1
                    }
                };
            }
            _context.Products.Add(product);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> Delete(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if(product == null) throw new SWPException($"Cannot find product:{productId}");

            _context.Products.Remove(product);
            return await _context.SaveChangesAsync();
        }



        public async Task<PageResult<ProductViewModel>> GetAllPagning(GetProductPagingRequest request)
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
            if(request.CategoryIds.Count > 0)
            {
                query = query.Where(p => request.CategoryIds.Contains(p.c.CategoriesId));
            }
            //3. Paging
            int totalRow =await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x =>new ProductViewModel()
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

        public async Task<int> Update(ProductUpdateRequest request)
        {
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null) throw new SWPException($"Cannot find product with id: {request.ProductId}");

            product.ProductName = request.ProductName;
            product.Description = request.Description;
            product.CategoriesId = request.CategoriesId;
            return await _context.SaveChangesAsync();

        }

        public async Task<bool> UpdatePrice(int productId, float newPrice)
        {
            var product = await _context.Products.FindAsync(productId);
            if(product == null) throw new SWPException($"Cannot find product with id: {productId}");
            product.Price = newPrice;
            return await _context.SaveChangesAsync() > 0 ;
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
    }
}
