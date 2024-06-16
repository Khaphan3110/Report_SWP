using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Sales;
using SWPSolution.ViewModels.Sales;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            string orderDetailId = GenerateOrderId();
            var order = new Order
            {
                OrderId = orderId,
                MemberId = await ExtractMemberIdFromTokenAsync(orderRequest.Token),
                PromotionId = orderRequest.PromotionId,
                ShippingAddress = orderRequest.ShippingAddress,
                TotalAmount = orderRequest.TotalAmount,
                OrderStatus = OrderStatus.InProgress,
                OrderDate = DateTime.UtcNow,
            };

            foreach (var product in orderRequest.OrderDetails)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = orderId,
                    OrderdetailId = "OR191004", // Ensure this generates unique IDs
                    ProductId = product.ProductId,
                    Quantity = product.Quantity,
                };

                order.OrderDetails.Add(orderDetail);
            }

            _context.Orders.Add(order);
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


        public async Task<Order> GetOrderById(string orderId)
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payments)
                .Include(o => o.Promotion)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);
        }

        public IEnumerable<Order> GetOrdersByMemberId(string memberId)
        {
            return _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payments)
                .Include(o => o.Promotion)
                .Where(o => o.MemberId == memberId)
                .ToList();
        }

        public async Task<bool> PlaceOrderAsync(OrderRequest orderRequest)
        {
            try
            {
                var order = await CreateOrder(orderRequest);
                return order != null;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> UpdateOrderStatus(string orderId, OrderStatus newStatus)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if(order == null) throw new SWPException("Order not found");

            order.OrderStatus = newStatus;
            await _context.SaveChangesAsync();
            return ("Update succeed!");
        }

        private string GenerateOrderId()
        {
            // Generate order_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"OR{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextAutoIncrement(string month, string year)
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
