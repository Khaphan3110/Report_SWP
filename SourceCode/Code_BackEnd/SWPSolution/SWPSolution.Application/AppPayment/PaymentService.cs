using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SWPSolution.ViewModels.Payment;
using SWPSolution.Data.Entities;
using SWPSolution.Utilities.Exceptions;
using System.Data.Entity;

namespace SWPSolution.Application.AppPayment
{
    public class PaymentService : IPaymentService
    {
        private readonly SWPSolutionDBContext _context;

        public PaymentService(SWPSolutionDBContext context)
        {
            _context = context;
        }

        // Payment creation
        public async Task<string> Create(PaymentRequest request)
        {
            var orderExists =  _context.Orders.Any(o => o.OrderId == request.OrderId);
            var preorderExists =  _context.PreOrders.Any(po => po.PreorderId == request.OrderId);

            if (!orderExists && !preorderExists)
            {
                throw new Exception("Order or PreOrder not found");
            }

            var payment = new Payment
            {
                PaymentId = GeneratePaymentId(),
                OrderId = request.OrderId,
                Amount = request.Amount,
                DiscountValue = request.DiscountValue,
                PaymentStatus = request.PaymentStatus,
                PaymentMethod = request.PaymentMethod,
                PaymentDate = request.PaymentDate,
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            var insertedPayment = await _context.Payments.FirstOrDefaultAsync(p => p.OrderId == request.OrderId);
            if (insertedPayment == null)
            {
                throw new Exception("Failed to retrieve the newly inserted payment from the database.");
            }
            return insertedPayment.PaymentId;
        }

        // Payment deletion
        public async Task<bool> Delete(string id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return false;

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return true;
        }

        // Payment retrieval
        public async Task<List<Payment>> GetAll()
        {
            return _context.Payments.ToList();
        }

        public async Task<Payment> GetById(string id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return null;

            return new Payment
            {
                PaymentId = payment.PaymentId,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                DiscountValue = payment.DiscountValue,
                PaymentStatus = payment.PaymentStatus,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = payment.PaymentDate,
            };
        }

        // Payment updates
        public async Task<int> Update(string id, PaymentRequest request)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) throw new SWPException($"Cannot find payment with id: {id}");

            payment.Amount = request.Amount;
            payment.DiscountValue = request.DiscountValue;
            payment.PaymentStatus = request.PaymentStatus;
            payment.PaymentMethod = request.PaymentMethod;
            payment.PaymentDate = request.PaymentDate;
            payment.OrderId = request.OrderId;

            _context.Payments.Update(payment);
            return await _context.SaveChangesAsync();
        }

        // ID generation
        private string GeneratePaymentId()
        {
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");
            int autoIncrement = GetNextAutoIncrement(month, year);
            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"PM{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextAutoIncrement(string month, string year)
        {
            string pattern = $"PM{month}{year}";
            var maxAutoIncrement = _context.Payments
                .Where(c => c.PaymentId.StartsWith(pattern))
                .Select(c => c.PaymentId.Substring(6, 3))
                .AsEnumerable()
                .Select(s => int.Parse(s))
                .DefaultIfEmpty(0)
                .Max();

            return maxAutoIncrement + 1;
        }
    }
}
