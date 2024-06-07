using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Categories;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

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
            var category = new Category
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

        public async Task<bool> Update(string id, CategoryUpdateRequest request)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            if (!string.IsNullOrEmpty(request.BrandName))
                category.BrandName = request.BrandName;

            if (!string.IsNullOrEmpty(request.AgeRange))
                category.AgeRange = request.AgeRange;

            if (!string.IsNullOrEmpty(request.SubCategories))
                category.SubCategories = request.SubCategories;

            if (!string.IsNullOrEmpty(request.PackageType))
                category.PackageType = request.PackageType;

            if (!string.IsNullOrEmpty(request.Source))
                category.Source = request.Source;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Delete(string id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CategoriesVM> GetById(string id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return null;

            return new CategoriesVM
            {
                CategoriesId = category.CategoriesId,
                BrandName = category.BrandName,
                AgeRange = category.AgeRange,
                SubCategories = category.SubCategories,
                PackageType = category.PackageType,
                Source = category.Source
            };
        }

        public async Task<List<CategoriesVM>> GetAll()
        {
            return await _context.Categories
                .Select(c => new CategoriesVM
                {
                    CategoriesId = c.CategoriesId,
                    BrandName = c.BrandName,
                    AgeRange = c.AgeRange,
                    SubCategories = c.SubCategories,
                    PackageType = c.PackageType,
                    Source = c.Source
                })
                .ToListAsync();
        }
    }
}

