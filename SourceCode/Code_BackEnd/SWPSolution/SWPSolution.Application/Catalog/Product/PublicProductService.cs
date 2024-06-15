using SWPSolution.Data.Entities;
using Microsoft.EntityFrameworkCore;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Common;
using Azure.Core;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
                        //join r in _context.Reviews on p.ProductId equals r.ProductId
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
                }).ToListAsync();
            return data;
        }

        public async Task<PageResult<ProductViewModel>> GetAllByCategoryId(GetPublicProductPagingRequest request)
        {
            //1. Request Join
            var query = from p in _context.Products
                        join c in _context.Categories on p.CategoriesId equals c.CategoriesId
                        join r in _context.Reviews on p.ProductId equals r.ProductId
                        select new { p, r, c };
            //2. Filter
            if (!string.IsNullOrEmpty(request.CategoryId) && request.CategoryId.Length > 0)
            {
                query = query.Where(p => p.c.CategoriesId == request.CategoryId);
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
    }
}
