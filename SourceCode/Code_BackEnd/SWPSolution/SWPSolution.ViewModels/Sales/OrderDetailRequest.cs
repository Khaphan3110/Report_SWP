using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Sales
{
    public class OrderDetailRequest
    {
        public string OrderId { get; set; }

        [Required]
        public string ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]

        public float Price { get; set; }
    }
}
