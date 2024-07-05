﻿using Microsoft.Extensions.Configuration;
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
                PromotionId = orderRequest.PromotionId,
                ShippingAddress = orderRequest.ShippingAddress,
                TotalAmount = orderRequest.TotalAmount,
                OrderStatus = OrderStatus.InProgress,
                OrderDetails = new List<OrderDetail>(),
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
            return _context.Orders
                .Select(c => new Order
                {
                    OrderId = c.OrderId,
                    MemberId = c.MemberId,
                    PromotionId = c.PromotionId,
                    ShippingAddress = c.ShippingAddress,
                    TotalAmount = c.TotalAmount,
                    OrderStatus = c.OrderStatus,
                    OrderDate = c.OrderDate,
                    OrderDetails = c.OrderDetails,
                    
                })
                .ToList();
        }


        public async Task<OrderVM> GetOrderById(string orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
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
                .ToList();
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
        public async Task<string> UpdateOrderStatus(string orderId, OrderStatus newStatus)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null) throw new SWPException("Order not found");

            order.OrderStatus = newStatus;
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

            // Construct the message using the MessageVM constructor

            var recipientEmail = await _context.Members.FindAsync(memberId);
            var message = new MessageVM(
                new List<string> { recipientEmail.Email }, // Pass recipient as a list
                "Payment Receipt",
                $@"
            <h1>Payment Receipt</h1>
            <p>Thank you for your purchase!</p>
            <p>Order ID: {order.OrderId}</p>
            <p>Total Amount: {order.TotalAmount}</p>
        "
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
