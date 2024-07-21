using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Data.Entities;
using Microsoft.EntityFrameworkCore;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.Catalog.Categories;
using System.Globalization;

namespace SWPSolution.Application.Sales
{
    public class OrderService : IOrderService
    {
        private readonly IOrderService _orderService;
        private readonly SWPSolutionDBContext _context;
        private readonly IConfiguration _config;

        public OrderService(SWPSolutionDBContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        public async Task<Order> CreateOrder(OrderRequest orderRequest)
        {
            string orderId = GenerateOrderId();
            var order = new Order
            {
                OrderId = orderId,
                MemberId = await ExtractMemberIdFromTokenAsync(orderRequest.Token),
                PromotionId = orderRequest.PromotionId,  // Nullable
                ShippingAddress = orderRequest.ShippingAddress,  // Nullable
                TotalAmount = orderRequest.TotalAmount,
                OrderStatus = OrderStatus.InProgress,
                OrderDetails = new List<OrderDetail>(),
                OrderDate = DateTime.Now
            };

            // Add the order to the context but do not save changes immediately
            _context.Orders.Add(order);

            // Validate product quantities
            foreach (var product in orderRequest.OrderDetails)
            {
                var productInDb = await _context.Products.FindAsync(product.ProductId);
                if (productInDb == null || productInDb.Quantity < product.Quantity)
                {
                    throw new SWPException($"Product {product.ProductId} does not have sufficient quantity.");
                }
            }

            // Save the order without waiting for it to complete
            await _context.SaveChangesAsync();

            // Now add order details
            foreach (var product in orderRequest.OrderDetails)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = orderId,
                    OrderdetailId = GenerateOrderDetailId(),
                    ProductId = product.ProductId,
                    Price = product.Price,
                    Quantity = product.Quantity,
                };

                // Add orderDetail to the order's collection
                order.OrderDetails.Add(orderDetail);

                // Add orderDetail to the context but do not save changes immediately
                _context.OrderDetails.Add(orderDetail);
                await _context.SaveChangesAsync();
            }

            // Save all order details
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<Order> UpdateOrderAsync(string orderId, OrderRequest orderRequest)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var order = await _context.Orders.Include(o => o.OrderDetails)
                                                 .FirstOrDefaultAsync(o => o.OrderId == orderId);
                if (order == null) throw new SWPException("Order not found");

                // Update order main details if not null
                if (orderRequest.PromotionId != null)
                {
                    order.PromotionId = orderRequest.PromotionId;
                }
                if (orderRequest.ShippingAddress != null)
                {
                    order.ShippingAddress = orderRequest.ShippingAddress;
                }
                if (orderRequest.TotalAmount != null)
                {
                    order.TotalAmount = orderRequest.TotalAmount;
                }
                order.OrderStatus = OrderStatus.InProgress;

                _context.Orders.Update(order);

                // Update order details if not null
                if (orderRequest.OrderDetails != null)
                {
                    var existingOrderDetails = order.OrderDetails.ToList();
                    foreach (var existingDetail in existingOrderDetails)
                    {
                        var updatedDetail = orderRequest.OrderDetails
                                               .FirstOrDefault(d => orderId == existingDetail.OrderId && d.ProductId == existingDetail.ProductId);
                        if (updatedDetail != null)
                        {
                            // Update existing order detail
                            existingDetail.ProductId = updatedDetail.ProductId;
                            existingDetail.Price = updatedDetail.Price;
                            existingDetail.Quantity = updatedDetail.Quantity;
                        }
                        else
                        {
                            // Remove order detail if it's not in the request
                            _context.OrderDetails.Remove(existingDetail);
                        }
                    }

                    // Add new order details
                    foreach (var newDetail in orderRequest.OrderDetails)
                    {
                        if (existingOrderDetails.All(d => d.ProductId != newDetail.ProductId))
                        {
                            var orderDetail = new OrderDetail
                            {
                                OrderId = orderId,
                                OrderdetailId = GenerateOrderDetailId(),
                                ProductId = newDetail.ProductId,
                                Price = newDetail.Price,
                                Quantity = newDetail.Quantity,
                            };
                            // Detach any existing tracked instances
                            var trackedEntity = _context.ChangeTracker.Entries<OrderDetail>()
                                                        .FirstOrDefault(e => e.Entity.OrderdetailId == orderDetail.OrderdetailId);
                            if (trackedEntity != null)
                            {
                                _context.Entry(trackedEntity.Entity).State = EntityState.Detached;
                            }
                            order.OrderDetails.Add(orderDetail);
                            _context.OrderDetails.Add(orderDetail);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return order;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
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

        public async Task<List<Order>> GetAll()
        {
            return await _context.Orders
                .Include(c => c.Member)
                .Include(c => c.Payments)
                .Include(c => c.OrderDetails)
                    .ThenInclude(od => od.Product)
                        .Include(c => c.Promotion)
                .Select(c => new Order
                {
                    OrderId = c.OrderId,
                    MemberId = c.MemberId,
                    PromotionId = c.PromotionId,
                    ShippingAddress = c.ShippingAddress,
                    TotalAmount = c.TotalAmount,
                    OrderStatus = c.OrderStatus,
                    OrderDate = c.OrderDate,
                    OrderDetails = c.OrderDetails.Select(od => new OrderDetail
                    {
                        OrderdetailId = od.OrderdetailId,
                        OrderId = od.OrderId,
                        ProductId = od.ProductId,
                        Quantity = od.Quantity,
                        Price = od.Price,
                        Product = new Product
                        {
                            ProductId = od.Product.ProductId,
                            ProductName = od.Product.ProductName
                        }
                    }).OrderByDescending(od => od.OrderdetailId).ToList(),
                    Member = new Member
                    {
                        MemberId = c.Member.MemberId,
                        FirstName = c.Member.FirstName,
                        LastName = c.Member.LastName,
                        Email = c.Member.Email,
                        PhoneNumber = c.Member.PhoneNumber,
                        LoyaltyPoints = c.Member.LoyaltyPoints,
                    },
                    Payments = c.Payments.Select(p => new Payment
                    {
                        PaymentId = p.PaymentId,
                        OrderId = p.OrderId,
                        PreorderId = p.PreorderId,
                        Amount = p.Amount,
                        DiscountValue = p.DiscountValue,
                        PaymentStatus = p.PaymentStatus,
                        PaymentDate = p.PaymentDate,
                        PaymentMethod = p.PaymentMethod
                    }).OrderByDescending(p => p.PaymentId).ToList(),
                    Promotion = new Promotion
                    {
                        PromotionId = c.Promotion.PromotionId,
                        Name = c.Promotion.Name,
                        DiscountType = c.Promotion.DiscountType,
                        DiscountValue = c.Promotion.DiscountValue,
                        StartDate = c.Promotion.StartDate,
                        EndDate = c.Promotion.EndDate
                    }
                })
                .OrderByDescending(c => c.OrderId)
                .ToListAsync();
        }


        public async Task<OrderVM> GetOrderById(string orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
            {
                return null;
            }
            return new OrderVM
            {
                OrderId = order.OrderId,
                MemberId = order.MemberId,
                PromotionId = order.PromotionId,
                ShippingAddress = order.ShippingAddress,
                TotalAmount = (double)order.TotalAmount,
                OrderStatus = order.OrderStatus,
                OrderDate = (DateTime)order.OrderDate,
            };
        }

        public IEnumerable<Order> GetOrdersByMemberId(string memberId)
        {
            return _context.Orders
                .Where(o => o.MemberId == memberId)
                .OrderByDescending(o => o.OrderId) // Sort by OrderId
                .ToList();
        }

        public async Task<PageResult<Order>> GetOrdersPagingAsync(OrderPagingRequest request)
        {
            var query = _context.Orders
                .Include(o => o.Promotion) // Include Promotion
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(o => o.OrderId.Contains(request.Keyword));
            }

            if (request.Status.HasValue)
            {
                query = query.Where(o => o.OrderStatus == request.Status);
            }

            if (!string.IsNullOrEmpty(request.MemberId))
            {
                query = query.Where(o => o.MemberId == request.MemberId);
            }

            var ordersQuery = query.Select(o => new Order
            {
                OrderId = o.OrderId,
                MemberId = o.MemberId,
                PromotionId = o.PromotionId,
                ShippingAddress = o.ShippingAddress,
                TotalAmount = o.TotalAmount,
                OrderStatus = o.OrderStatus,
                OrderDate = o.OrderDate,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetail
                {
                    OrderdetailId = od.OrderdetailId,
                    OrderId = od.OrderId,
                    ProductId = od.ProductId,
                    Quantity = od.Quantity,
                    Price = od.Price,
                    Product = new Product
                    {
                        ProductId = od.Product.ProductId,
                        ProductName = od.Product.ProductName
                    }
                }).OrderByDescending(od => od.OrderdetailId).ToList(),
                Promotion = new Promotion
                {
                    PromotionId = o.Promotion.PromotionId,
                    Name = o.Promotion.Name,
                    DiscountType = o.Promotion.DiscountType,
                    DiscountValue = o.Promotion.DiscountValue,
                    StartDate = o.Promotion.StartDate,
                    EndDate = o.Promotion.EndDate
                }
            })
            .OrderByDescending(o => o.OrderId); // Sort by OrderId

            int totalRow = await query.CountAsync();
            var pagedData = await ordersQuery
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PageResult<Order>
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                Items = pagedData,
                TotalRecords = totalRow
            };
        }

        public async Task<PageResult<Order>> GetTrackingOrdersPagingAsync(OrderTrackingPagingRequest request)
        {
            var query = _context.Orders
                .Include(o => o.Promotion) // Include Promotion
                .AsQueryable();

            // Filter by specific OrderStatus values (0, 1, 2)
            var allowedStatuses = new List<OrderStatus> { OrderStatus.InProgress, OrderStatus.Confirmed, OrderStatus.Shipping };

            // Apply filters
            query = query.Where(o => allowedStatuses.Contains(o.OrderStatus));

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(o => o.OrderId.Contains(request.Keyword));
            }

            if (!string.IsNullOrEmpty(request.MemberId))
            {
                query = query.Where(o => o.MemberId == request.MemberId);
            }
            if (request.Status.HasValue)
            {
                var statusValue = (OrderStatus)request.Status.Value; // Ensure request.Status is cast to OrderStatus
                query = query.Where(o => o.OrderStatus == statusValue);
            }

            var ordersQuery = query.Select(o => new Order
            {
                OrderId = o.OrderId,
                MemberId = o.MemberId,
                PromotionId = o.PromotionId,
                ShippingAddress = o.ShippingAddress,
                TotalAmount = o.TotalAmount,
                OrderStatus = o.OrderStatus,
                OrderDate = o.OrderDate,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetail
                {
                    OrderdetailId = od.OrderdetailId,
                    OrderId = od.OrderId,
                    ProductId = od.ProductId,
                    Quantity = od.Quantity,
                    Price = od.Price,
                    Product = new Product
                    {
                        ProductId = od.Product.ProductId,
                        ProductName = od.Product.ProductName
                    }
                }).OrderByDescending(od => od.OrderdetailId).ToList(),
                Promotion = new Promotion
                {
                    PromotionId = o.Promotion.PromotionId,
                    Name = o.Promotion.Name,
                    DiscountType = o.Promotion.DiscountType,
                    DiscountValue = o.Promotion.DiscountValue,
                    StartDate = o.Promotion.StartDate,
                    EndDate = o.Promotion.EndDate
                }
            });

            int totalRow = await query.CountAsync();
            var pagedData = await ordersQuery
                .OrderByDescending(o => o.OrderId)
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PageResult<Order>
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                Items = pagedData,
                TotalRecords = totalRow
            };
        }


        public async Task<PageResult<Order>> GetOrdersHistoryPagingAsync(OrderHistoryPagingRequest request)
        {
            var query = _context.Orders.AsQueryable();

            // Filter by specific OrderStatus values (-1, 3)
            var allowedStatuses = new List<OrderStatus> { OrderStatus.Canceled, OrderStatus.Complete };

            // Apply filters
            query = query.Where(o => allowedStatuses.Contains(o.OrderStatus));

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(o => o.OrderId.Contains(request.Keyword));
            }

            if (!string.IsNullOrEmpty(request.MemberId))
            {
                query = query.Where(o => o.MemberId == request.MemberId);
            }
            if (request.Status.HasValue)
            {
                var statusValue = (OrderStatus)request.Status.Value; // Ensure request.Status is cast to OrderStatus
                query = query.Where(o => o.OrderStatus == statusValue);
            }

            var ordersQuery = query.Select(o => new Order
            {
                OrderId = o.OrderId,
                MemberId = o.MemberId,
                PromotionId = o.PromotionId,
                ShippingAddress = o.ShippingAddress,
                TotalAmount = o.TotalAmount,
                OrderStatus = o.OrderStatus,
                OrderDate = o.OrderDate,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetail
                {
                    OrderdetailId = od.OrderdetailId,
                    OrderId = od.OrderId,
                    ProductId = od.ProductId,
                    Quantity = od.Quantity,
                    Price = od.Price,
                    Product = new Product
                    {
                        ProductId = od.Product.ProductId,
                        ProductName = od.Product.ProductName
                    }
                }).OrderByDescending(od => od.OrderdetailId)
                .ToList(),
                Promotion = new Promotion
                {
                    PromotionId = o.Promotion.PromotionId,
                    Name = o.Promotion.Name,
                    DiscountType = o.Promotion.DiscountType,
                    DiscountValue = o.Promotion.DiscountValue,
                    StartDate = o.Promotion.StartDate,
                    EndDate = o.Promotion.EndDate
                }

            });

            int totalRow = await query.CountAsync();
            var pagedData = await ordersQuery
                .OrderByDescending(o => o.OrderId)
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PageResult<Order>
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                Items = pagedData,
                TotalRecords = totalRow
            };
        }


        public async Task<PlaceOrderResult> PlaceOrderAsync(OrderRequest orderRequest)
        {
            try
            {
                var order = await CreateOrder(orderRequest);
                return new PlaceOrderResult
                {
                    Success = order != null,
                    Order = order
                };
            }
            catch (Exception ex)
            {
                return new PlaceOrderResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<(double TotalRevenueForWeek, Dictionary<DayOfWeek, double> RevenueByDay)> GetTotalRevenueForCurrentWeek()
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

            // Fetch the orders within the current week from the database
            var orders = await _context.Orders
                .Where(o => o.OrderDate >= startDateOfWeek && o.OrderDate < endDateOfWeek)
                .ToListAsync();

            // Initialize a dictionary to store total revenue for each day of the week
            var revenueByDay = new Dictionary<DayOfWeek, double>();

            // Populate the dictionary with all days of the week set to zero initially
            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                revenueByDay[day] = 0;
            }

            // Group the orders by day of the week and calculate the totals in memory
            var groupedOrders = orders
                .GroupBy(o => o.OrderDate.DayOfWeek)
                .Select(g => new
                {
                    Day = g.Key,
                    TotalRevenue = g.Sum(o => o.TotalAmount)
                })
                .ToList();

            // Populate the dictionary with the results
            foreach (var orderGroup in groupedOrders)
            {
                revenueByDay[orderGroup.Day] = orderGroup.TotalRevenue;
            }

            // Calculate the total revenue for the week
            double totalRevenueForWeek = orders.Sum(o => o.TotalAmount);

            return (totalRevenueForWeek, revenueByDay);
        }

        public async Task<(int TotalOrdersForWeek, Dictionary<DayOfWeek, int> OrdersByDay)> GetTotalOrdersForCurrentWeek()
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

            // Fetch the orders within the current week from the database
            var orders = await _context.Orders
                .Where(o => o.OrderDate >= startDateOfWeek && o.OrderDate < endDateOfWeek)
                .ToListAsync();

            // Initialize a dictionary to store total orders for each day of the week
            var ordersByDay = new Dictionary<DayOfWeek, int>();

            // Populate the dictionary with all days of the week set to zero initially
            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                ordersByDay[day] = 0;
            }

            // Group the orders by day of the week and calculate the totals in memory
            var groupedOrders = orders
                .GroupBy(o => o.OrderDate.DayOfWeek)
                .Select(g => new
                {
                    Day = g.Key,
                    TotalOrders = g.Count()
                })
                .ToList();

            // Populate the dictionary with the results
            foreach (var orderGroup in groupedOrders)
            {
                ordersByDay[orderGroup.Day] = orderGroup.TotalOrders;
            }

            // Calculate the total number of orders for the week
            int totalOrdersForWeek = orders.Count;

            return (totalOrdersForWeek, ordersByDay);
        }
        public async Task<string> UpdateOrderStatus(string orderId, OrderStatus newStatus)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null) throw new SWPException("Order not found");

            order.OrderStatus = newStatus;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return ("Update succeed!");
        }

        public async Task<string> CancelOrderAsync(string orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null) throw new SWPException("Order not found");

            if (order.OrderStatus != OrderStatus.InProgress)
            {
                throw new SWPException("Only orders that are in progress can be canceled.");
            }

            order.OrderStatus = OrderStatus.Canceled;
            await _context.SaveChangesAsync();
            return "Order canceled successfully!";
        }

        private string GenerateOrderId()
        {
            // Generate order_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextOrderIdAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"OR{month}{year}{formattedAutoIncrement}";
        }


        //Emailing Receipt
        public async Task SendReceiptEmailAsync(string memberId, Order order)
        {
            // Load email configuration 
            var emailConfig = _config.GetSection("EmailConfiguration").Get<EmailVM>();
            var emailService = new EmailService(emailConfig);

            // Retrieve the member's email address
            var member = await _context.Members.FindAsync(memberId);
            if (member == null)
            {
                throw new Exception("Member not found");
            }

            // Ensure the order details and associated product information are loaded
            var fullOrder = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.OrderId == order.OrderId);

            if (fullOrder == null)
            {
                throw new Exception("Order not found");
            }

            // Construct the email body with order details
            var emailBody = $@"
        <h1>Payment Receipt</h1>
        <p>Thank you for your purchase!</p>
        <p>Order ID: {fullOrder.OrderId}</p>
        <p>Total Amount: {fullOrder.TotalAmount:C}</p>
        <h2>Purchased Items:</h2>
        <table border='1' cellpadding='5' cellspacing='0'>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>";

            foreach (var item in fullOrder.OrderDetails)
            {
                emailBody += $@"
            <tr>
                <td>{item.Product.ProductName}</td>
                <td>{item.Quantity}</td>
                <td>{item.Price:C}</td>
            </tr>";
            }

            emailBody += "</table>";

            // Construct the message using the MessageVM constructor
            var message = new MessageVM(
                new List<string> { member.Email }, // Pass recipient as a list
                "Payment Receipt",
                emailBody
            );

            // Send the email
            emailService.SendEmail(message);
        }


        private string GenerateOrderDetailId()
        {
            // Generate order_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextOrderDetailIdAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"OD{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextOrderDetailIdAutoIncrement(string month, string year)
        {
            // Generate the pattern for order_ID to match in SQL query
            string pattern = $"OD{month}{year}";

            // Retrieve the maximum auto-increment value from existing order details for the given month and year
            var maxAutoIncrement = _context.OrderDetails
                .Where(o => o.OrderdetailId.StartsWith(pattern))
                .Select(o => o.OrderdetailId.Substring(6, 3)) // Select substring of auto-increment part
                .AsEnumerable() // Switch to client evaluation from this point
                .Select(s => int.Parse(s)) // Parse string to int
                .DefaultIfEmpty(0)
                .Max();

            return maxAutoIncrement + 1;
        }


        private int GetNextOrderIdAutoIncrement(string month, string year)
        {
            // Generate the pattern for order_ID to match in SQL query
            string pattern = $"OR{month}{year}";

            // Retrieve the maximum auto-increment value from existing orders for the given month and year
            var maxAutoIncrement = _context.Orders
                .Where(o => o.OrderId.StartsWith(pattern))
                .Select(o => o.OrderId.Substring(6, 3)) // Select substring of auto-increment part
                .AsEnumerable() // Switch to client evaluation from this point
                .Select(s => int.Parse(s)) // Parse string to int
                .DefaultIfEmpty(0)
                .Max();

            return maxAutoIncrement + 1;
        }

    }
}
