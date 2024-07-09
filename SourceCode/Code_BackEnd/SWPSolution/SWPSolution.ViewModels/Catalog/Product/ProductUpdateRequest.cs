﻿using Microsoft.AspNetCore.Http;

namespace SWPSolution.ViewModels.Catalog.Product
{
    public class ProductUpdateRequest
    {
        public string ProductId { get; set; }

        public string ProductName { get; set; }

        public int? Quantity { get; set; }

        public float? Price { get; set; }

        public string Description { get; set; }


        public string StatusDescription { get; set; }


        //public IFormFile ThumbnailImage { get; set; }


    }
}
