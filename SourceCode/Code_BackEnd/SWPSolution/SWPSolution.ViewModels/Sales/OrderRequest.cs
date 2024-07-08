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

        public string? ShippingAddress { get; set; }

        public string? PromotionId { get; set; }

        [Required]
        public List<OrderDetailRequest> OrderDetails { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Total amount must be a positive value.")]
        public float TotalAmount { get; set; }
    }
}
