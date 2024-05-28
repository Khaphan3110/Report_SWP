using SWPSolution.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Catalog.Product.Public
{
    public class GetProductPagingRequest : PagingRequestBase
    {
        public string categoryId { get; set; }
    }
}
