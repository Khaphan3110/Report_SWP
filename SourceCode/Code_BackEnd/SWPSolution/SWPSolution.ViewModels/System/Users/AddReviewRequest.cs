using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.System.Users
{
    public class AddReviewRequest
    {
        public string ProductId { get; set; }
        public DateTime? DateReview { get; set; }
        public int Grade { get; set; }
        public string Comment { get; set; }
    }
}
