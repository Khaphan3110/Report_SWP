using SWPSolution.ViewModels.Catalog.Sales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Sales
{
    public class OrderRequest
    {
        [Required]
        public string Token { get; set; }

        [Required]
        public string ShippingAddress { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public List<OrderDetailVM> OrderDetails { get; set; }
    }
}
