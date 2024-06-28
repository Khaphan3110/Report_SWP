using SWPSolution.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.System.Users
{
    public class OrderVM
    {
        public string OrderId { get; set; }

        public string MemberId { get; set; }

        public string PromotionId { get; set; }

        public string ShippingAddress { get; set; }

        public double TotalAmount { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public DateTime OrderDate { get; set; }

    }
}
