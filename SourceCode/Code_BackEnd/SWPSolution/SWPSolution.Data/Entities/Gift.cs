using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Data.Entities
{
    public class Gift
    {
        public int GiftId { get; set; }
        public string GiftName { get; set; }
        public decimal RequiredPoints { get; set; }

        public virtual ICollection<GiftPurchase> GiftPurchases { get; set; } = new List<GiftPurchase>();
    }
}
