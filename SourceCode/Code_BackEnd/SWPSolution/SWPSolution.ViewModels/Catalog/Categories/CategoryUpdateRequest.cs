using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Catalog.Categories
{
    public class CategoryUpdateRequest
    {
        public string BrandName { get; set; }
        public string AgeRange { get; set; }
        public string SubCategories { get; set; }
        public string PackageType { get; set; }
        public string Source { get; set; }
    }
}
