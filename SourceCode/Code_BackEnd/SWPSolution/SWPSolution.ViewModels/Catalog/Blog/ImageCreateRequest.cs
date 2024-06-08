﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Catalog.Blog
{
    public class ImageCreateRequest
    {
        public string ImagePath { get; set; }
        public string Caption { get; set; }
        public int SortOrder { get; set; }
        public long FileSize { get; set; }
    }
}
