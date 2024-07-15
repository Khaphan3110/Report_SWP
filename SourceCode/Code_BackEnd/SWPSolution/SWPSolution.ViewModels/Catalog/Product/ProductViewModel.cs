using SWPSolution.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Catalog.Product
{
    public class ProductViewModel
    {
        public string ProductId { get; set; }
        public string CategoriesId { get; set; }
        public string ProductName { get; set; }
        public int? Quantity { get; set; }
        public double? Price { get; set; }
        public string Description { get; set; }
        public ProductStatus? StatusDescription { get; set; }
        public string Image { get; set; }
    }
}
