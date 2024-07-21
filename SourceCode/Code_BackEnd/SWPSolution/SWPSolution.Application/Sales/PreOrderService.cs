using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.AppPayment;
using SWPSolution.Application.AppPayment.VNPay;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Common;
using SWPSolution.ViewModels.Payment;
using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace SWPSolution.Application.Sales
{
    public class PreOrderService : IPreOrderService
    {
        private readonly SWPSolutionDBContext _context;
        private readonly IEmailService _emailService;
        private readonly IPaymentService _paymentService;
        private readonly IConfiguration _config;
        private readonly IVnPayService _vnPayService;

        public PreOrderService(SWPSolutionDBContext context, IEmailService emailService, IPaymentService paymentService, IConfiguration config, IVnPayService vnPayService)
        {
            _context = context;
            _emailService = emailService;
            _paymentService = paymentService;
            _config = config;
            _vnPayService = vnPayService;
        }

        public async Task<IEnumerable<PreOrder>> GetDepositedPreOrdersAsync()
        {
            return _context.PreOrders
                .Where(p => p.Status == PreOrderStatus.Deposited)
                .OrderByDescending(p => p.PreorderId) // Added ordering
                .ToList();
        }

        public async Task<PreOrder> CreatePreOrder(CreatePreOrderRequest model)
        {
            var product = await _context.Products.FindAsync(model.ProductId);
            if (product == null || product.StatusDescription.Equals(ProductStatus.NotAvailable))
            {
                var preOrder = new PreOrder
                {
                    PreorderId = GeneratePreOrderId(),
                    ProductId = model.ProductId,
                    MemberId = await ExtractMemberIdFromTokenAsync(model.Token),
                    ShippingAddress = model.ShippingAddress,
                    Quantity = model.Quantity,
                    PreorderDate = DateTime.UtcNow,
                    Price = model.Total,
                    Status = PreOrderStatus.Created,
                };

                _context.PreOrders.Add(preOrder);
                await _context.SaveChangesAsync();

                return preOrder;
            }

            throw new InvalidOperationException("Product is available, no need for preorder.");
        }

        public async Task<PreOrder> GetPreOrder(string preorderId)
        {
            return await _context.PreOrders
                .Include(po => po.Product)
                .Include(po => po.Member)
                .Where(po => po.PreorderId == preorderId)
                .OrderByDescending(po => po.PreorderId) // Ordering
                .FirstOrDefaultAsync();
        }

        public async Task<PageResult<PreOrder>> GetPreOrdersPagingAsync(PreOrderPagingRequest request)
        {
            var query = _context.PreOrders
                .Include(o => o.Product)
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.MemberId))
            {
                query = query.Where(o => o.MemberId.Equals(request.MemberId));
            }
            if (request.PreOrderStatus.HasValue)
            {
                query = query.Where(o => o.Status == request.PreOrderStatus.Value);
            }

            int totalRow = query.Count();

            var pagedData = query
                .OrderByDescending(p => p.PreorderId) // Ordering
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new PreOrder
                {
                    MemberId = p.MemberId,
                    PreorderId = p.PreorderId,
                    PreorderDate = p.PreorderDate,
                    ProductId = p.ProductId,
                    ShippingAddress = p.ShippingAddress,
                    Quantity = p.Quantity,
                    Status = p.Status,
                    Price = p.Price,
                    Product = new Product
                    {
                        ProductId = p.ProductId,
                        ProductName = p.Product.ProductName,
                        Price = p.Product.Price,
                        CategoriesId = p.Product.CategoriesId,
                        ProductImages = p.Product.ProductImages,
                    }
                })
                .ToList();

            return new PageResult<PreOrder>
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                TotalRecords = totalRow,
                Items = pagedData
            };
        }

        public async Task<PageResult<PreOrder>> GetPreOrdersTrackingPagingAsync(PreOrderTrackingPagingRequest request)
        {
            var query = _context.PreOrders
                .Include(o => o.Product)
                .Include(o => o.Payments)
                .Where(p => new List<PreOrderStatus> { PreOrderStatus.Created, PreOrderStatus.Deposited }.Contains(p.Status))
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.MemberId))
            {
                query = query.Where(o => o.MemberId.Equals(request.MemberId));
            }
            if (request.Status.HasValue)
            {
                var statusValue = (PreOrderStatus)request.Status.Value;
                query = query.Where(o => o.Status == statusValue);
            }

            int totalRow = query.Count();

            var pagedData = query
                .OrderByDescending(p => p.PreorderId) // Ordering
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new PreOrder
                {
                    MemberId = p.MemberId,
                    PreorderId = p.PreorderId,
                    PreorderDate = p.PreorderDate,
                    ProductId = p.ProductId,
                    ShippingAddress = p.ShippingAddress,
                    Quantity = p.Quantity,
                    Status = p.Status,
                    Price = p.Price,
                    Product = new Product
                    {
                        ProductId = p.ProductId,
                        ProductName = p.Product.ProductName,
                        Price = p.Product.Price,
                        CategoriesId = p.Product.CategoriesId,
                        ProductImages = p.Product.ProductImages,
                        StatusDescription = p.Product.StatusDescription,
                    },
                    Payments = p.Payments.Select(pay => new Payment
                    {
                        PaymentId = pay.PaymentId,
                        OrderId = pay.OrderId,
                        PreorderId = pay.PreorderId,
                        Amount = pay.Amount,
                        DiscountValue = pay.DiscountValue,
                        PaymentStatus = pay.PaymentStatus,
                        PaymentDate = pay.PaymentDate,
                        PaymentMethod = pay.PaymentMethod
                    }).ToList()

                })
                .ToList();

            return new PageResult<PreOrder>
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                TotalRecords = totalRow,
                Items = pagedData
            };
        }


        public async Task<PageResult<PreOrder>> GetPreOrdersHistoryPagingAsync(PreOrderHistoryPagingRequest request)
        {
            var query = _context.PreOrders
                .Include(o => o.Product)
                .Include(o => o.Payments)
                .Where(p => new List<PreOrderStatus> { PreOrderStatus.Completed, PreOrderStatus.Canceled }.Contains(p.Status))
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.MemberId))
            {
                query = query.Where(o => o.MemberId.Equals(request.MemberId));
            }
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(o => o.Product.ProductName.Contains(request.Keyword));
            }

            int totalRow = query.Count();

            var pagedData =  query
                .OrderByDescending(p => p.PreorderId) // Ordering
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new PreOrder
                {
                    MemberId = p.MemberId,
                    PreorderId = p.PreorderId,
                    PreorderDate = p.PreorderDate,
                    ProductId = p.ProductId,
                    ShippingAddress = p.ShippingAddress,
                    Quantity = p.Quantity,
                    Status = p.Status,
                    Price = p.Price,
                    Product = new Product
                    {
                        ProductId = p.ProductId,
                        ProductName = p.Product.ProductName,
                        Price = p.Product.Price,
                        CategoriesId = p.Product.CategoriesId,
                        ProductImages = p.Product.ProductImages,
                    },
                    Payments = p.Payments.Select(pay => new Payment
                    {
                        PaymentId = pay.PaymentId,
                        OrderId = pay.OrderId,
                        PreorderId = pay.PreorderId,
                        Amount = pay.Amount,
                        DiscountValue = pay.DiscountValue,
                        PaymentStatus = pay.PaymentStatus,
                        PaymentDate = pay.PaymentDate,
                        PaymentMethod = pay.PaymentMethod
                    }).ToList()
                })
                .ToList();

            return new PageResult<PreOrder>
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                TotalRecords = totalRow,
                Items = pagedData
            };
        }

        public async Task<List<PreOrder>> GetAll()
        {
            return await _context.PreOrders
                .Include(c => c.Payments)
                .Include(o => o.Product)
                .OrderByDescending(c => c.PreorderId) // Ordering
                .Select(c => new PreOrder
                {
                    PreorderId = c.PreorderId,
                    ProductId = c.ProductId,
                    MemberId = c.MemberId,
                    ShippingAddress = c.ShippingAddress,
                    Quantity = c.Quantity,
                    PreorderDate = c.PreorderDate,
                    Price = c.Price,
                    Status = c.Status,
                    Payments = c.Payments.Select(p => new Payment
                    {
                        PaymentId = p.PaymentId,
                        OrderId = p.OrderId,
                        PreorderId = p.PreorderId,
                        Amount = p.Amount,
                        DiscountValue = p.DiscountValue,
                        PaymentStatus = p.PaymentStatus,
                        PaymentMethod = p.PaymentMethod,
                        PaymentDate = p.PaymentDate,
                    })
                    .OrderByDescending(m => m.PaymentId) // Ordering
                    .ToList(),
                    Product = new Product
                    {
                        ProductId = c.ProductId,
                        ProductName = c.Product.ProductName,
                        Price = c.Product.Price,
                        CategoriesId = c.Product.CategoriesId,
                        ProductImages = c.Product.ProductImages,
                    }
                })
                .ToListAsync();
        }

        public async Task<bool> IsProductAvailable(string productId)
        {
            var product = await _context.Products.FindAsync(productId);
            return product.StatusDescription.Equals(ProductStatus.InStock);
        }

        public async Task NotifyCustomer(string memberId, PreOrder preorder, string paymentUrl)
        {
            // Retrieve email configuration
            var emailConfig = _config.GetSection("EmailConfiguration").Get<EmailVM>();
            var emailService = new EmailService(emailConfig);

            // Retrieve the member details
            var member = await _context.Members.FindAsync(memberId);
            if (member == null)
            {
                throw new InvalidOperationException("Member not found.");
            }

            // Construct the email message
            var messageContent = preorder.Status == PreOrderStatus.Deposited
                ? $@"
            <h1>Your Preorder is Ready for Shipping</h1>
            <p>Thank you for your preorder!</p>
            <p>Preorder ID: {preorder.PreorderId}</p>
            <p>Total Amount: {preorder.Price}</p>
            <p>Please pay the remaining balance to complete your purchase.</p>
            <p><a href='{paymentUrl}'>Click here to pay the remaining amount</a></p>
        "
                : $@"
            <h1>Preorder Confirmation</h1>
            <p>Thank you for your preorder!</p>
            <p>Preorder ID: {preorder.PreorderId}</p>
            <p>Total Amount: {preorder.Price}</p>
            <p>Please pay the deposit to complete your preorder.</p>
            <p><a href='{paymentUrl}'>Click here to pay the deposit</a></p>
        ";

            var message = new MessageVM(
                new List<string> { member.Email }, // Pass recipient as a list
                preorder.Status == PreOrderStatus.Deposited ? "Preorder Ready for Shipping" : "Preorder Confirmation",
                messageContent
            );

            // Send the email
            emailService.SendEmail(message);
        }

        public async Task<Payment> ProcessPreOrderDeposit(string preorderId, double orderTotal)
        {
            var depositAmount = orderTotal;
            var paymentRequest = new PaymentRequest
            {
                PreOrderId = preorderId,
                Amount = depositAmount,
                DiscountValue = 0,
                PaymentStatus = false,
                PaymentMethod = "VNPay", // Assuming VNPay for simplicity
                PaymentDate = DateTime.UtcNow
            };

            var paymentId = await _paymentService.Create(paymentRequest);
            var payment = await _paymentService.GetById(paymentId);

            var preorder = await _context.PreOrders.FindAsync(preorderId);
            preorder.Status = PreOrderStatus.Created; // Assuming you have an enum for PreOrder status

            _context.PreOrders.Update(preorder);
            await _context.SaveChangesAsync();

            return payment;
        }

        //Emailing Receipt
        public async Task SendReceiptEmailAsync(string memberId, PreOrder preorder)
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
            <p>Thank you for your preorder purchase!</p>
            <p>Order ID: {preorder.PreorderId}</p>
            <p>Total Amount: {preorder.Price}</p>
        "
            );

            // Send the email
            emailService.SendEmail(message);
        }

        public async Task<string> CheckPreOrderAsync(string preorderId)
        {
            var preorder = await _context.PreOrders.FindAsync(preorderId);
            if (preorder == null)
            {
                return "Preorder not found";
            }

            var product = await _context.Products.FindAsync(preorder.ProductId);
            if (product != null && product.StatusDescription.Equals(ProductStatus.NotAvailable))
            {
                preorder.Status = PreOrderStatus.Deposited; // Update the preorder status
                _context.PreOrders.Update(preorder);
                await _context.SaveChangesAsync();

                return "ReadyForPayment";
            }

            return "Product is not yet available";
        }

        public async Task<string> GeneratePaymentUrlAndNotifyAsync(string preorderId, HttpContext httpContext)
        {
            var preorder = await _context.PreOrders.FindAsync(preorderId);
            if (preorder == null || preorder.Status != PreOrderStatus.Deposited)
            {
                return "Preorder not found or not ready for payment";
            }

            var paymentUrl = GeneratePaymentUrl(preorder, httpContext);
            await NotifyCustomer(preorder.MemberId, preorder, paymentUrl);
            return "Customer has been notified to pay the remaining balance";
        }


        public async Task UpdateOrderStatus(string preorderId, PreOrderStatus newStatus)
        {
            var preorder = await _context.PreOrders.FindAsync(preorderId);
            if (preorder == null)
            {
                throw new InvalidOperationException("Preorder not found.");
            }

            preorder.Status = newStatus;

            _context.PreOrders.Update(preorder);
            await _context.SaveChangesAsync();
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

        private string GeneratePaymentUrl(PreOrder preorder, HttpContext httpContext)
        {
            // Find all payments with PaymentStatus = true for the given preorder
            var payment = _context.Payments
                .FirstOrDefault(p => p.PreorderId == preorder.PreorderId && p.PaymentStatus == true);

            // Calculate the remaining amount
            var remainingAmount = payment != null ? preorder.Price - payment.Amount : preorder.Price;

            var vnPayModel = new VnPaymentRequestModel
            {
                Amount = remainingAmount, // Remaining amount
                CreatedDate = DateTime.UtcNow,
                Description = $"Payment for preorder {preorder.PreorderId}",
                FullName = preorder.MemberId,
                OrderId = preorder.PreorderId,
                PaymentId = payment.PaymentId // Use the first payment's ID or 0 if no payments exist
            };

            var paymentUrl = _vnPayService.CreatePaymentUrl(httpContext, vnPayModel);
            return paymentUrl;
        }

        private string GeneratePreOrderId()
        {
            // Generate order_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextPreOrderIdAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"PO{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextPreOrderIdAutoIncrement(string month, string year)
        {
            // Generate the pattern for order_ID to match in SQL query
            string pattern = $"PO{month}{year}";

            // Retrieve the maximum auto-increment value from existing order details for the given month and year
            var maxAutoIncrement = _context.PreOrders
                .Where(o => o.PreorderId.StartsWith(pattern))
                .Select(o => o.PreorderId.Substring(6, 3)) // Select substring of auto-increment part
                .AsEnumerable() // Switch to client evaluation from this point
                .Select(s => int.Parse(s)) // Parse string to int
                .DefaultIfEmpty(0)
                .Max();

            return maxAutoIncrement + 1;
        }
    }
}
