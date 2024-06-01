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
        public async Task<string> Create(CategoryCreateRequest request)
        {
            var category = new Data.Entities.Category()
            {
                CategoriesId = request.CategoriesId,
                BrandName = request.BrandName,
                AgeRange = request.AgeRange,
                SubCategories = request.SubCategories,
                PackageType = request.PackageType,
                Source = request.Source
            };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category.CategoriesId;
        }
    }
}
