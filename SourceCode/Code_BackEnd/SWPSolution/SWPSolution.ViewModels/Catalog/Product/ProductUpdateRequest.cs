using Microsoft.AspNetCore.Http;

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

<<<<<<< HEAD
        public IFormFile ThumbnailImage { get; set; }

=======
>>>>>>> 004a9fe0bb8fa12f69eb1c57aaf523cd2e6f9c8b
    }
}
