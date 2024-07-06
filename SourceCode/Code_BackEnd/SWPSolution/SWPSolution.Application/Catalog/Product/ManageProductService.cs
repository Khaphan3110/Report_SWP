using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.Common;
using SWPSolution.Data.Entities;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Product;
using SWPSolution.ViewModels.Catalog.ProductImage;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.System.Users;
using System.Data.Entity;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace SWPSolution.Application.Catalog.Product
{
    public class ManageProductService : IManageProductService
    {
        private readonly SWPSolutionDBContext _context;
        private readonly IStorageService _storageService;
        private readonly IConfiguration _config;
        public ManageProductService(SWPSolutionDBContext context, IStorageService storageService, IConfiguration config)
        {
            _context = context;
            _config = config;
            _storageService = storageService;
        }

        public async Task<string> Create(ProductCreateRequest request)
        {
            string generatedId = GenerateCategoriesId();
            var product = new Data.Entities.Product()
            {
                ProductId = generatedId,
                CategoriesId = request.CategoryId,
                ProductName = request.ProductName,
                Quantity = request.Quantity,
                Price = request.Price,
                Description = request.Description,
                Image = request.ThumbnailImage.ToString()

            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            // Fetch the newly inserted product from the database
            var insertedProduct = _context.Products.FirstOrDefault(p => p.ProductName == request.ProductName && p.Quantity == request.Quantity && p.Price == request.Price && p.Description == request.Description);

            // Check if insertedProduct is null or ProductId is empty
            if (insertedProduct == null || string.IsNullOrEmpty(insertedProduct.ProductId))
            {
                throw new Exception("Failed to retrieve the newly inserted product from the database.");
            }
            //Save image
            if (request.ThumbnailImage != null)
            {
                var productId = insertedProduct.ProductId;

                var productImage = new ProductImage()
                {
                    ProductId = productId,
                    Caption = "Thumbnail image",
                    DateCreated = DateTime.Now,
                    FileSize = request.ThumbnailImage.Length,
                    ImagePath = await this.SaveFile(request.ThumbnailImage),
                    SortOrder = 1
                };

                _context.ProductImages.Add(productImage);
                await _context.SaveChangesAsync(); // Save changes for ProductImage entity
            }
            return insertedProduct.ProductId;
    }

            public async Task<int> Delete(string productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) throw new SWPException($"Cannot find product:{productId}");

            var images = _context.ProductImages.Where(i => i.ProductId == productId);
            foreach( var image in images) 
            { 
               await _storageService.DeleteFileAsync(image.ImagePath);
            }
           
            _context.Products.Remove(product);
            
            return await _context.SaveChangesAsync();
        }



        public async Task<PageResult<ProductViewModel>> GetAllPagning(GetManageProductPagingRequest request)
        {
            //1. Request Join
            var query = from p in _context.Products
                        join c in _context.Categories on p.CategoriesId equals c.CategoriesId
                        join r in _context.Reviews on p.ProductId equals r.ProductId
                        select new { p, r, c };
            //2. Filter
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(x => x.p.ProductName.Contains(request.Keyword));
            }
            if (request.CategoryIds.Count > 0)
            {
                query = query.Where(p => request.CategoryIds.Contains(p.c.CategoriesId));
            }
            //3. Paging
            int totalRow = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new ProductViewModel()
                {
                    
                    CategoriesId = x.p.CategoriesId,
                    ProductName = x.p.ProductName,
                    Description = x.p.Description,
                    Price = x.p.Price,
                    Quantity = x.p.Quantity,
                }).ToListAsync();
            //4. Select and projection
            var pageResult = new PageResult<ProductViewModel>()
            {
				TotalRecords = totalRow,
				PageIndex = request.PageIndex,
				PageSize = request.PageSize,
				Items = data,

			};
            return pageResult;
        }


        public async Task<int> Update(ProductUpdateRequest request)
        {
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null) throw new SWPException($"Cannot find product with id: {request.ProductId}");


           
            product.CategoriesId = request.CategoriesId;
            product.ProductName = request.ProductName;
            product.Description = request.Description;
            product.CategoriesId = request.CategoriesId;

            //Save image
            if (request.ThumbnailImage != null)
            {
                var thumbnailImage =await _context.ProductImages.FirstOrDefaultAsync(i => i.ProductId == request.ProductId);
                if (thumbnailImage != null)
                {
                    thumbnailImage.FileSize = request.ThumbnailImage.Length;
                    thumbnailImage.ImagePath = await this.SaveFile(request.ThumbnailImage);
                    _context.ProductImages.Update(thumbnailImage);
                }
            }
            return await _context.SaveChangesAsync();

        }


        public async Task<int> UpdateQuantity(string ProductId, UpdateQuantityRequest request)
        {
            var product = await _context.Products.FindAsync(ProductId);
            if (product == null) throw new SWPException($"Cannot find product with id: {ProductId}");



            product.Quantity = request.Quantity;

            _context.Update(product);

            return await _context.SaveChangesAsync();

        }

        public async Task<List<string>> CreateMultipleProducts(List<ListProductCreateRequest> requests)
        {
            var productIds = new List<string>();

            foreach (var request in requests)
            {
                string generatedId = GenerateCategoriesId();
                var product = new Data.Entities.Product()
                {
                    ProductId = generatedId,
                    CategoriesId = request.CategoriesId,
                    ProductName = request.ProductName,
                    Quantity = request.Quantity,
                    Price = request.Price,
                    Description = request.Description,
                    StatusDescription = request.StatusDescription,
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync(); // Use async SaveChanges method

                // Fetch the newly inserted product from the database asynchronously
                var insertedProduct =  _context.Products.FirstOrDefault(p => p.ProductId == generatedId);

                if (insertedProduct == null)
                {
                    throw new InvalidOperationException("Failed to retrieve inserted product.");
                }

                productIds.Add(insertedProduct.ProductId);
            }

            return productIds;
        }

        
        public async Task<bool> UpdatePrice(string productId, float newPrice)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) throw new SWPException($"Cannot find product with id: {productId}");
            product.Price = newPrice;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateQuantity(int productId, int addedQuantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) throw new SWPException($"Cannot find product with id: {productId}");
            product.Quantity += addedQuantity;
            return await _context.SaveChangesAsync() > 0;
        }

        

        private async Task<string> SaveFile(IFormFile file)
        {
            var originalFilename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(originalFilename)}";
            await _storageService.SaveFileAsync(file.OpenReadStream(), fileName);
            return fileName;
        }


        // Images
        public async Task<int> AddImage(string productId, ProductImageCreateRequest request)
        {
            var productImage = new ProductImage()
            {
                Caption = request.Caption,
                DateCreated = DateTime.Now,
                SortOrder = request.SortOrder,
                ProductId = productId,
            };
            if(request.ImageFile != null)
            {
                productImage.ImagePath = await this.SaveFile (request.ImageFile);
                productImage.FileSize = request.ImageFile.Length;
            }
            _context.ProductImages.Add(productImage);
            await _context.SaveChangesAsync();
            return productImage.Id; 
        }
        public async Task<int> AddMultipleImages(string productId, List<ProductImageCreateRequest> requests)
        {
            foreach (var request in requests)
            {
                var productImage = new ProductImage()
                {
                    ProductId = productId,
                    Caption = request.Caption,
                    DateCreated = DateTime.Now,
                    SortOrder = request.SortOrder,
                };

                if (request.ImageFile != null)
                {
                    productImage.ImagePath = await SaveFile(request.ImageFile);
                    productImage.FileSize = request.ImageFile.Length;
                }

                _context.ProductImages.Add(productImage);
            }

            return await _context.SaveChangesAsync();
        }

        //Task<ProductViewModel> GetById(string productId);

        public Dictionary<DayOfWeek, int> GetInventoryChangesForCurrentWeek()
        {
            var currentDate = DateTime.Now;
            var currentCulture = CultureInfo.CurrentCulture;
            var firstDayOfWeek = currentCulture.DateTimeFormat.FirstDayOfWeek;

            // Calculate the start date of the current week
            var startDateOfWeek = currentDate.Date;
            while (startDateOfWeek.DayOfWeek != firstDayOfWeek)
            {
                startDateOfWeek = startDateOfWeek.AddDays(-1);
            }

            // Calculate the end date of the current week
            var endDateOfWeek = startDateOfWeek.AddDays(7);

            // Fetch the order details within the current week from the database
            var orderDetails = _context.OrderDetails
                .Include(od => od.Order)
                .Where(od => od.Order.OrderDate >= startDateOfWeek && od.Order.OrderDate < endDateOfWeek)
                .ToList();

            // Initialize a dictionary to store inventory changes for each day of the week
            var inventoryChangesByDay = new Dictionary<DayOfWeek, int>();

            // Populate the dictionary with all days of the week set to zero initially
            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                inventoryChangesByDay[day] = 0;
            }

            // Group the order details by day of the week and calculate the totals in memory
            var groupedOrderDetails = orderDetails
                .Where(od => od.Order != null) // Ensure Order is not null
                .GroupBy(od => od.Order.OrderDate.DayOfWeek)
                .Select(g => new
                {
                    Day = g.Key,
                    TotalChange = g.Sum(od => od.Quantity)
                })
                .ToList();

            // Populate the dictionary with the results
            foreach (var changeGroup in groupedOrderDetails)
            {
                inventoryChangesByDay[changeGroup.Day] = changeGroup.TotalChange;
            }

            return inventoryChangesByDay;
        }
        public async Task<ProductViewModel> GetById(string productId)
        {
            var product = await _context.Products.FindAsync(productId);

            var productViewModel = new ProductViewModel()
            {
                ProductId = product.ProductId,
                Description = product.Description,
                Price = product.Price,
                ProductName = product.ProductName,
                Quantity = product.Quantity,
                CategoriesId = product.CategoriesId,
            };
            return productViewModel;
        }

        public async Task<List<ProductImageViewModel>> GetListImages(string productId)
        {
            return  _context.ProductImages
                .Where(x => x.ProductId == productId)
                .Select(i => new ProductImageViewModel
                {
                    Caption = i.Caption,
                    DateCreated = i.DateCreated,
                    FileSize = i.FileSize,
                    Id = i.Id,
                    ImagePath = i.ImagePath,
                    ProductId = i.ProductId,
                    SortOrder = i.SortOrder
                })
                .ToList();
        }

        public async Task<int> RemoveImage(string imageId)
        {
            var productImage = await _context.ProductImages.FindAsync(imageId);
            if(productImage == null)
            {
                throw new SWPException($"Cannot find image with id {imageId} to remove ");
            }
            _context.ProductImages.Remove(productImage);
           return await _context.SaveChangesAsync();
        }
        public async Task<int> UpdateImage(string imageId, ProductImageUpdateRequest request)
        {
            var productImage =await _context.ProductImages.FindAsync(imageId);
            if(productImage == null)
            {
                throw new SWPException($"Cannot find an image with  id {imageId}");
            }
            if (request.ImageFile != null)
            {
                productImage.ImagePath = await this.SaveFile(request.ImageFile);
                productImage.FileSize = request.ImageFile.Length;
            }
            _context.ProductImages.Update(productImage);
            return await _context.SaveChangesAsync();
        }

        public async Task<ProductImageViewModel> GetImageById(int imageId)
        {
            var image = await _context.ProductImages.FindAsync(imageId);
            if (image == null)
                throw new SWPException($"Cannot find image with id {imageId}");
            var viewModel = new ProductImageViewModel()
            {
                Caption = image.Caption,
                DateCreated = image.DateCreated,
                FileSize = image.FileSize,
                Id = image.Id,
                ImagePath = image.ImagePath,
                ProductId = image.ProductId,
                SortOrder = image.SortOrder

            };
            return viewModel;
        }
        private string GenerateCategoriesId()
        {
            // Generate categories_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"PM{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextAutoIncrement(string month, string year)
        {
            // Generate the pattern for categories_ID to match in SQL query
            string pattern = $"PM{month}{year}";

            // Retrieve the maximum auto-increment value from existing categories for the given month and year
            var maxAutoIncrement = _context.Products
                .Where(c => c.ProductId.StartsWith(pattern))
                .Select(c => c.ProductId.Substring(6, 3)) // Select substring of auto-increment part
                .AsEnumerable() // Switch to client evaluation from this point
                .Select(s => int.Parse(s)) // Parse string to int
                .DefaultIfEmpty(0)
                .Max();

            return maxAutoIncrement + 1;
        }

        public async Task<bool> AddReview(string memberId, AddReviewRequest request)
        {
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return false;

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null) return false;

            var review = new Review
            {
                ReviewId = "",
                ProductId = request.ProductId,
                MemberId = memberId,
                DataReview = DateTime.Now,
                Grade = request.Grade,
                Comment = request.Comment,
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<ReviewVM>> GetReviewsByMemberId(string memberId)
        {
            var reviews = _context.Reviews
                                        .Where(m => m.MemberId == memberId)
                                        .Select(m => new ReviewVM
                                        {
                                            reviewId = m.ReviewId,
                                            productId = m.ProductId,
                                            memberId = m.MemberId,
                                            dateReview = m.DataReview,
                                            grade = m.Grade,
                                            comment = m.Comment,
                                        })
                                        .ToList();

            if (!reviews.Any())
            {
                throw new KeyNotFoundException($"Reviews for member ID {memberId} not found.");
            }

            return reviews;
        }

        public async Task<List<ReviewVM>> GetReviewsByProductId(string productId)
        {
            var reviews = _context.Reviews
                                        .Where(m => m.ProductId == productId)
                                        .Select(m => new ReviewVM
                                        {
                                            reviewId = m.ReviewId,
                                            productId = m.ProductId,
                                            memberId = m.MemberId,
                                            dateReview = m.DataReview,
                                            grade = m.Grade,
                                            comment = m.Comment,
                                        })
                                        .ToList();

            if (!reviews.Any())
            {
                throw new KeyNotFoundException($"Reviews for product ID {productId} not found.");
            }

            return reviews;
        }

        public async Task<List<ReviewVM>> GetReviewsByMemberIdAndProductId(string memberId, string productId)
        {
            var reviews = _context.Reviews
                                        .Where(m => m.MemberId == memberId && m.ProductId == productId)
                                        .Select(m => new ReviewVM
                                        {
                                            reviewId = m.ReviewId,
                                            productId = m.ProductId,
                                            memberId = m.MemberId,
                                            dateReview = m.DataReview,
                                            grade = m.Grade,
                                            comment = m.Comment,
                                        })
                                        .ToList();

            if (!reviews.Any())
            {
                throw new KeyNotFoundException($"Reviews for member ID {memberId} with product ID {productId} not found.");
            }

            return reviews;
        }

        public async Task<List<ReviewVM>> GetAllReview()
        {
            var review = _context.Reviews
                                        .Select(m => new ReviewVM
                                        {
                                            reviewId = m.ReviewId,
                                            productId = m.ProductId,
                                            memberId = m.MemberId,
                                            dateReview = m.DataReview,
                                            grade = m.Grade,
                                            comment = m.Comment,
                                        })
                                        .ToList();
            return review;
        }

        public async Task<bool> DeleteReview(string memberId, string productId)
        {
            var review = _context.Reviews.FirstOrDefault(r => r.MemberId == memberId && r.ProductId == productId);
            if (review == null)
                return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<string> ExtractMemberIdFromTokenAsync(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtPayloadBase64Url = token.Split('.')[1];
            var jwtPayloadBase64 = jwtPayloadBase64Url
                                    .Replace('-', '+')
                                    .Replace('_', '/')
                                    .PadRight(jwtPayloadBase64Url.Length + (4 - jwtPayloadBase64Url.Length % 4) % 4, '=');
            var jwtPayload = Encoding.UTF8.GetString(Convert.FromBase64String(jwtPayloadBase64));
            var jwtSecret = _config["JWT:SigningKey"];

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            SecurityToken validatedToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out validatedToken);
            var memberId = principal.FindFirst("member_id")?.Value;

            return memberId;
        }
    }
}
