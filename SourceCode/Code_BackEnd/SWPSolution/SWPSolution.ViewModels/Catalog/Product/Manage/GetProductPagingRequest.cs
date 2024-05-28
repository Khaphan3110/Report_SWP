using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWPSolution.ViewModels.Common;

namespace SWPSolution.ViewModels.Catalog.Product.Manage
{
    public class GetProductPagingRequest : PagingRequestBase
    {
        public string Keyword { get; set; }
        public List<string> CategoryIds { get; set; }


    }
}
