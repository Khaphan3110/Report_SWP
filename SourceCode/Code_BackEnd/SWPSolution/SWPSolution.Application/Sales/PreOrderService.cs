using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SWPSolution.Application.AppPayment;
using SWPSolution.Application.System.User;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Payment;
using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
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

        public PreOrderService(SWPSolutionDBContext context, IEmailService emailService, IPaymentService paymentService, IConfiguration config)
        {
            _context = context;
            _emailService = emailService;
            _paymentService = paymentService;
            _config = config;
        }
        public async Task<PreOrder> CreatePreOrder(string productId, string memberId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null || product.Quantity < quantity)
            {
                var preOrder = new PreOrder
                {
                    PreorderId = GeneratePreOrderId(),
                    ProductId = productId,
                    MemberId = memberId,
                    Quantity = quantity,
                    PreorderDate = DateTime.UtcNow,
                    Price = product.Price * quantity
                };

                _context.PreOrders.Add(preOrder);
                await _context.SaveChangesAsync();

                return preOrder;
            }

            throw new InvalidOperationException("Product is available, no need for preorder.");
        }

        public async Task<PreOrder> GetPreOrder(string preorderId)
        {
            return _context.PreOrders
                .Include(po => po.Product)
                .Include(po => po.Member)
                .FirstOrDefault(po => po.PreorderId == preorderId);
        }

        public async Task<List<PreOrder>> GetAll()
        {
            return _context.PreOrders
                .Select(c => new PreOrder
                {
                    PreorderId= c.PreorderId,
                    ProductId= c.ProductId,
                    MemberId = c.MemberId,
                    Quantity = c.Quantity,
                    PreorderDate = c.PreorderDate,
                    Price = c.Price,
                })
                .ToList();
        }

        public async Task<bool> IsProductAvailable(string productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            return product != null && product.Quantity >= quantity;
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
            var depositAmount = orderTotal * 0.15;
            var paymentRequest = new PaymentRequest
            {
                OrderId = preorderId,
                Amount = depositAmount,
                DiscountValue = 0,
                PaymentStatus = true,
                PaymentMethod = "VNPay", // Assuming VNPay for simplicity
                PaymentDate = DateTime.UtcNow
            };

            var paymentId = await _paymentService.Create(paymentRequest);
            var payment = await _paymentService.GetById(paymentId);

            var preorder = await _context.PreOrders.FindAsync(preorderId);
            preorder.Status = PreOrderStatus.Deposited; // Assuming you have an enum for PreOrder status

            _context.PreOrders.Update(preorder);
            await _context.SaveChangesAsync();

            return payment;
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

        private string GeneratePreOrderId()
        {
            // Generate order_ID based on current month, year, and auto-increment
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextPreOrderIdAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"POR{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextPreOrderIdAutoIncrement(string month, string year)
        {
            // Generate the pattern for order_ID to match in SQL query
            string pattern = $"POR{month}{year}";

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
