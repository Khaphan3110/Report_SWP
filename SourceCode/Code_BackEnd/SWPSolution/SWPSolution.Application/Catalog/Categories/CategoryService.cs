using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Categories;

namespace SWPSolution.Application.Catalog.Categories
{
    public class CategoryService : ICategoryService
    {
        
        private readonly SWPSolutionDBContext _context;

        public CategoryService(SWPSolutionDBContext context)
        {
            _context = context;
           
        }
        public async Task<bool> Create(CategoryCreateRequest request)
        {
            try
            {
                var category = new Data.Entities.Category()
                {
                    CategoriesId = "",
                    BrandName = request.BrandName,
                    AgeRange = request.AgeRange,
                    SubCategories = request.SubCategories,
                    PackageType = request.PackageType,
                    Source = request.Source
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Log the exception (ex) here as needed
                return false;
            }
        }
    }
}
