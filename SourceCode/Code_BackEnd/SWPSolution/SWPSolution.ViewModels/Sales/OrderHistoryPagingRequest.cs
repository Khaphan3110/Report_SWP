using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Sales
{
    public class OrderHistoryPagingRequest : PagingRequestBase
    {
        public string? Keyword { get; set; }

        public string? MemberId { get; set; }

        public OrderHistoryStatus? Status { get; set; }
    }
}
