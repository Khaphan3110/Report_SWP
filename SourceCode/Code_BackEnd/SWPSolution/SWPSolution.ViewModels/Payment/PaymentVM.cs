using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Payment
{
    public class PaymentVM
    {
        public string PaymentId { get; set; }

        public string OrderId { get; set; }

        public decimal Amount { get; set; }

        public double DiscountValue { get; set; }

        public bool PaymentStatus { get; set; }

        public string PaymentMethod { get; set; }

        public DateTime PaymentDate { get; set; }
    }
}
