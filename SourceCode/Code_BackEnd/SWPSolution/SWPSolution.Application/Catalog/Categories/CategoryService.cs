using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Categories;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Common;

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
            string generatedId = GenerateCategoriesId();
            var category = new Category
            {
                CategoriesId = generatedId,
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

        public async Task<bool> CreateMultiple(List<CategoryCreateRequest> requests)
        {
            foreach (var request in requests)
            {
                string generatedId = GenerateCategoriesId();
                var category = new Category
                {
                    CategoriesId = generatedId,
                    BrandName = request.BrandName,
                    AgeRange = request.AgeRange,
                    SubCategories = request.SubCategories,
                    PackageType = request.PackageType,
                    Source = request.Source
                };
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }
            
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

        public async Task<int> GetTotalCategoryCountAsync()
        {
            return await _context.Categories.CountAsync();
        }
        public async Task<PageResult<CategoriesVM>> GetAllPaging(CategoryPagingRequest request)
        {
            // 1. Query with Filtering
            var query = _context.Categories.AsQueryable(); // Start from Categories table

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                // Adjust filtering to your relevant category fields
                query = query.Where(c => c.BrandName.Contains(request.Keyword) ||
                                        c.SubCategories.Contains(request.Keyword) 
                                        // ... other fields you want to filter on
                                       );
            }

            // 2. Projection to CategoriesVM (No need for joins here)
            var categoryData = await query.Select(c => new CategoriesVM
            {
                CategoriesId = c.CategoriesId,
                BrandName = c.BrandName,
                AgeRange = c.AgeRange,
                SubCategories = c.SubCategories,
                PackageType = c.PackageType,
                Source = c.Source
            }).ToListAsync();

            // 3. Paging (Same as before)
            int totalRow = categoryData.Count;
            var pagedData = categoryData
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            // 4. Result
            return new PageResult<CategoriesVM>
            {
                TotalRecords = totalRow,
                Items = pagedData
            };
        }






        private string GenerateCategoriesId()
        {
            // Generate categories_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"CM{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextAutoIncrement(string month, string year)
        {
            // Generate the pattern for categories_ID to match in SQL query
            string pattern = $"CM{month}{year}";

            // Retrieve the maximum auto-increment value from existing categories for the given month and year
            var maxAutoIncrement = _context.Categories
                .Where(c => c.CategoriesId.StartsWith(pattern))
                .Select(c => c.CategoriesId.Substring(6, 3)) // Select substring of auto-increment part
                .AsEnumerable() // Switch to client evaluation from this point
                .Select(s => int.Parse(s)) // Parse string to int
                .DefaultIfEmpty(0)
                .Max();

            return maxAutoIncrement + 1;
        }
    }
}

