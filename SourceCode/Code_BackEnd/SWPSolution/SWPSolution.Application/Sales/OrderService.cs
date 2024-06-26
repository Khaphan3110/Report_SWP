using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Data.Entities;
﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Categories;
using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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
                OrderDate = DateTime.UtcNow,
                OrderDetails = new List<OrderDetail>(),

            };

            // Add the order to the context but do not save changes immediately
            _context.Orders.Add(order);

            // Save the order without waiting for it to complete
            await _context.SaveChangesAsync();

            // Now add order details
            foreach (var product in orderRequest.OrderDetails)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = orderId,
                    OrderDetailId = GenerateOrderDetailId(),
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


            return null;
        }

        public class PlaceOrderResult
        {
            public bool Success { get; set; }
            public string ErrorMessage { get; set; }
            public Order Order { get; set; }
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

        private string GenerateOrderId()
        {
            // Generate order_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextOrderIdAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"OR{month}{year}{formattedAutoIncrement}";
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
                .Where(o => o.OrderDetailId.StartsWith(pattern))
                .Select(o => o.OrderDetailId.Substring(6, 3)) // Select substring of auto-increment part
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
