using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWPSolution.Data.Entities;

namespace SWPSolution.ViewModels.Sales
{
    public class PlaceOrderResult
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public Order Order { get; set; }
    }
}
