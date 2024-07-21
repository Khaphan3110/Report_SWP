using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Catalog.Blog
{
    public class BlogDetailVM
    {
        public string Id { get; set; }
        public string Title { get; set; }

        public string Content { get; set; }

        public string Categories { get; set; }

        public DateTime? DateCreate { get; set; }

        public string StaffId { get; set; }
    }
}
