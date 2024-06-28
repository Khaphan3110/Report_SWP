using SWPSolution.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.System.Users
{
    public class AddOrderRequest
    {
        public string PromotionId { get; set; }

        public string ShippingAddress { get; set; }

        public double TotalAmount { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public DateTime OrderDate { get; set; }
    }
}
