using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Payment
{
    public class PaymentRequest
    {
        public string OrderId { get; set; }

        public double Amount { get; set; }

        public double DiscountValue { get; set; }

        public bool PaymentStatus { get; set; }

        public string PaymentMethod { get; set; }

        public DateTime PaymentDate { get; set; }
    }
}
