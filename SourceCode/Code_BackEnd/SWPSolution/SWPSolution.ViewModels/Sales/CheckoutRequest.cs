using SWPSolution.ViewModels.Catalog.Sales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Sales
{
    public class CheckoutRequest
    {

        public string Name { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<OrderDetailVM> OrderDetails { get; set; } = new List<OrderDetailVM>();
    }
}
