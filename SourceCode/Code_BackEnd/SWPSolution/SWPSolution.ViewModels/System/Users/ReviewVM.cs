using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.System.Users
{
    public class ReviewVM
    {
        public string productId {  get; set; }
        public string memberId { get; set; }
        public DateTime? dateReview {  get; set; }
        public int? grade {  get; set; }
        public string comment { get; set; }
    }
}
