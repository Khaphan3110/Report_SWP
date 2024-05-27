using SWPSolution.Application.Catalog.Product.Dtos;
using SWPSolution.Application.Dtos;
using SWPSolution.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Catalog.Product
{
    public class ManageProductService : IManageProductService
    {
        private readonly SWPSolutionDBContext _context;
        public ManageProductService(SWPSolutionDBContext context)
        {
            _context = context;
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
            _context.Products.Add(product);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> Delete(int productId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ProductViewModel>> GetAll()
        {
            throw new NotImplementedException();
        }

        public async Task<PagedViewModel<ProductViewModel>> GetAllPagning(string keyword, int pageIndex, int pageSize)
        {
            throw new NotImplementedException();
        }

        public async Task<int> Update(UpdateProductEditRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
