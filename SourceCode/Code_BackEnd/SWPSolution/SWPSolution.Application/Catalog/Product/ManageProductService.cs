using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SWPSolution.Application.Common;
using SWPSolution.Data.Entities;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Common;
using System;
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

        public async Task<string> AddImages(string productId, List<FormFile> files)
        {
            var product = await _context.Products.FindAsync(productId);
            return product.ToString();
        }

        public async Task<string> Create(ProductCreateRequest request)
        {
            var product = new Data.Entities.Product()
            {
                ProductId = "", // Keep this assignment as it is
                CategoriesId = request.CategoryId,
                ProductName = request.ProductName,
                Quantity = request.Quantity,
                Price = request.Price,
                Description = request.Description
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

            // Save image
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
            foreach (var image in images)
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

        public Task<ProductViewModel> GetById(string productId)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProductImageViewModel>> GetListImage(int productId)
        {
            throw new NotImplementedException();
        }

        public Task<int> RemoveImages(string imageId, List<FormFile> files)
        {
            throw new NotImplementedException();
        }

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
                var thumbnailImage = await _context.ProductImages.FirstOrDefaultAsync(i => i.ProductId == request.ProductId);
                if (thumbnailImage != null)
                {
                    thumbnailImage.FileSize = request.ThumbnailImage.Length;
                    thumbnailImage.ImagePath = await this.SaveFile(request.ThumbnailImage);
                    _context.ProductImages.Update(thumbnailImage);
                }
            }
            return await _context.SaveChangesAsync();

        }

        public Task<int> UpdateImages(string imageId, string caption)
        {
            throw new NotImplementedException();
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
    }
}
