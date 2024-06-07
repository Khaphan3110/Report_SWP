using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Catalog.Categories
{
    public class ProductImageViewModel
    {
        public int Id { get; set; }
        public string FilePath { get; set; }

        public long FileSize { get; set; }
    }
}
