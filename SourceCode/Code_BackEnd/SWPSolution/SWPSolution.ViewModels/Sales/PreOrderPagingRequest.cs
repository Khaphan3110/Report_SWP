using SWPSolution.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Sales
{
    public class PreOrderPagingRequest : PagingRequestBase
    {
        public string? MemberId { get; set; }
    }
}
