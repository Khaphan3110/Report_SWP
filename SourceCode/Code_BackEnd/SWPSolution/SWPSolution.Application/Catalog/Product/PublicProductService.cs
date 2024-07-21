using SWPSolution.Data.Entities;
using Microsoft.EntityFrameworkCore;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Common;
using Azure.Core;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Microsoft.IdentityModel.Tokens;

namespace SWPSolution.Application.Catalog.Product
{
    public class PublicProductService : IPublicProductService
    {
        private readonly SWPSolutionDBContext _context;
        public PublicProductService(SWPSolutionDBContext context)
        {
            _context = context;
        }

        public async Task<List<ProductViewModel>> GetAll()
        {
            var query = from p in _context.Products
                        join c in _context.Categories on p.CategoriesId equals c.CategoriesId
                       // join r in _context.Reviews on p.ProductId equals r.ProductId
                        select new { p, c };

            int totalRow = await query.CountAsync();
            var data = await query.Select(x => new ProductViewModel()
            {
                ProductId = x.p.ProductId,
                CategoriesId = x.p.CategoriesId,
                ProductName = x.p.ProductName,
                Description = x.p.Description,
                Price = x.p.Price,
                Quantity = x.p.Quantity,
                StatusDescription = x.p.StatusDescription
            }).ToListAsync();
            return data;
        }

        public async Task<int> GetTotalProductCountAsync()
        {
            return await _context.Products.CountAsync();
        }


        public async Task<PageResult<ProductViewModel>> GetAllPaging(GetPublicProductPagingRequest request)
        {
            // 1. Query with Filtering & Category Check (Optional)
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(p => p.ProductName.Contains(request.Keyword));
            }

            if (!string.IsNullOrEmpty(request.CategoryId))
            {
                query = query.Where(p => p.CategoriesId == request.CategoryId);
            }

            // 2. Optimized Join & Grouping (Avoid N+1 Issue)
            var productData = await query
                .GroupJoin(_context.Reviews, p => p.ProductId, r => r.ProductId, (p, reviews) => new { p, reviews })
                .Select(x => new ProductViewModel
                {
                    ProductId = x.p.ProductId,  // Add for later reference
                    CategoriesId = x.p.CategoriesId,
                    ProductName = x.p.ProductName,
                    Description = x.p.Description,
                    Price = x.p.Price,
                    Quantity = x.p.Quantity,
                    StatusDescription = x.p.StatusDescription,
                    Image = x.p.Image

                })
                .ToListAsync();

            // 3. Paging
            int totalRow = productData.Count;

            var pagedData = productData
                .OrderByDescending(p => p.ProductId)
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList(); // ToList after paging for efficiency

            // 4. Result
            return new PageResult<ProductViewModel>
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                TotalRecords = totalRow,
                Items = pagedData
            };
        }


        public async Task<PageResult<ProductViewModel>> GetAllByCategoryId(GetPublicProductPagingRequest request)
        {
            // 1. Query with Filtering & Category Check (Optional)
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(p => p.ProductName.Contains(request.Keyword));
            }

            if (!string.IsNullOrEmpty(request.CategoryId))
            {
                query = query.Where(p => p.CategoriesId == request.CategoryId);
            }

            // 2. Optimized Join & Grouping (Avoid N+1 Issue)
            var productData = await query
                .GroupJoin(_context.Reviews, p => p.ProductId, r => r.ProductId, (p, reviews) => new { p, reviews })
                .Select(x => new ProductViewModel
                {
                    ProductId = x.p.ProductId,  // Add for later reference
                    CategoriesId = x.p.CategoriesId,
                    ProductName = x.p.ProductName,
                    Description = x.p.Description,
                    Price = x.p.Price,
                    Quantity = x.p.Quantity,

                })
                .ToListAsync();

            // 3. Paging
            int totalRow = productData.Count;

            var pagedData = productData
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList(); // ToList after paging for efficiency

            // 4. Result
            var pageResult = new PageResult<ProductViewModel>
            {
				TotalRecords = totalRow,
				PageIndex = request.PageIndex,
				PageSize = request.PageSize,
				Items = productData,
			};
            return pageResult;
        }

    }
}
