using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Catalog.Promotion
{
    public class PromotionVM
    {
        public string PromotionId { get; set; }

        public string Name { get; set; }

        public string DiscountType { get; set; }

        public int? DiscountValue { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
