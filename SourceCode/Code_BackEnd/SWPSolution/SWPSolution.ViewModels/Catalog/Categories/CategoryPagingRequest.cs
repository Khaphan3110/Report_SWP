using SWPSolution.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Catalog.Categories
{
    public class CategoryPagingRequest : PagingRequestBase
    {
        public string? Keyword { get; set; }
    }
}
