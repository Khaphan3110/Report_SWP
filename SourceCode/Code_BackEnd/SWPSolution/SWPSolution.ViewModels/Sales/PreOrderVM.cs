using SWPSolution.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Sales
{
    public class PreOrderVM
    {
        public string? PreorderId { get; set; }

        public string ProductId { get; set; }

        public string MemberId { get; set; }

        public int Quantity { get; set; }

        public DateTime PreorderDate { get; set; }

        public double Total { get; set; }

        public PreOrderStatus Status { get; set; }
    }
}
