using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Data.Entities
{
    public class GiftPurchase
    {
        public int GiftPurchaseId { get; set; }
        public string MemberId { get; set; }
        public int GiftId { get; set; }
        public DateTime PurchaseDate { get; set; }

        public virtual Member Member { get; set; }
        public virtual Gift Gift { get; set; }
    }
}
