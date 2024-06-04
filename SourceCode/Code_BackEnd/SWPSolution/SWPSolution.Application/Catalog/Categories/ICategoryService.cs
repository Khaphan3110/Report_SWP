using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWPSolution.ViewModels.Catalog.Categories;
using SWPSolution.ViewModels.Catalog.Product;

namespace SWPSolution.Application.Catalog.Categories
{
    public interface ICategoryService
    {
        Task<bool> Create(CategoryCreateRequest request);
    }
}
