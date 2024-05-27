using SWPSolution.Application.Catalog.Product.Dtos;
using SWPSolution.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Catalog.Product
{
    public interface IManageProductService
    {
        Task<int> Create(ProductCreateRequest request);

        Task<int> Update(UpdateProductEditRequest request);

        Task<int> Delete(int productId);

        Task<List<ProductViewModel>> GetAll();

        Task<PagedViewModel<ProductViewModel>> GetAllPagning(string keyword, int pageIndex, int pageSize);
    }
}
