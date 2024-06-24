using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.AppPayment;
using SWPSolution.Application.AppPayment.VNPay;
using SWPSolution.Application.Sales;
using SWPSolution.Application.Session;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Payment;
using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IConfiguration _config;
        private readonly IVnPayService _vnPayService;
        private readonly ISessionService _sessionService;
        private readonly IPaymentService _paymentService;
        private readonly SWPSolutionDBContext _context;

        public OrderController(IOrderService orderService, IConfiguration config, IVnPayService vnPayService, ISessionService sessionService, IPaymentService paymentService, SWPSolutionDBContext context)
        {
            _orderService = orderService;
            _config = config;
            _vnPayService = vnPayService;
            _sessionService = sessionService;
            _paymentService = paymentService;
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _orderService.PlaceOrderAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { error = result.ErrorMessage });
            }

            var payment = new PaymentRequest
            {
                OrderId = result.Order.OrderId,
                Amount = result.Order.TotalAmount,
                DiscountValue = 20,
                PaymentStatus = false
            };
            var paymentResult = await _paymentService.Create(payment);
            if (paymentResult == null)
            {
                return BadRequest(new { message = "Cannot create payment" });
            }

            return Ok(new
            {
                Order = result.Order,
                Payment = paymentResult
            });
        }

        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAll();
            if (orders == null)
            {
                return NotFound(new { message = "No categories were found" });
            }
            return Ok(orders);
        }

        [HttpGet("GetOrderById")]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            var order = await _orderService.GetOrderById(orderId);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpGet("member/{memberId}")]
        public IActionResult GetOrdersByMemberId(string memberId)
        {
            var orders = _orderService.GetOrdersByMemberId(memberId);
            return Ok(orders);
        }

        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(string orderId, [FromBody] UpdateOrderStatusRequest request)
        {
            await _orderService.UpdateOrderStatus(orderId, request.NewStatus);
            return NoContent();
        }

        [Authorize]
        [HttpPost("CheckoutVNPay")]
        public async Task<IActionResult> CheckoutVNPay([FromBody] OrderVM model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vnPayModel = new VnPaymentRequestModel
            {
                Amount = model.TotalAmount,
                CreatedDate = model.OrderDate,
                Description = $"{model.MemberId}",
                FullName = model.MemberId,
                OrderId = model.OrderId
            };

            // Create or update payment
            var paymentRequest = new PaymentRequest
            {
                OrderId = model.OrderId,
                Amount = model.TotalAmount,
                PaymentMethod = "VNPay", // Assuming VNPay as default or model.PaymentMethod
                PaymentStatus = false, // Example status, adjust as per your needs
                PaymentDate = DateTime.UtcNow // Example payment date, adjust as per your needs
            };

            // Check if payment already exists
            var existingPayment = await _context.Payments.FindAsync(model.OrderId);
            if (existingPayment != null)
            {
                // Update payment details
                await _paymentService.Update(model.OrderId, paymentRequest);
            }
            else
            {
                // Create new payment
                await _paymentService.Create(paymentRequest);
            }

            // Generate payment URL
            var paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, vnPayModel);

            return Ok(new { PaymentUrl = paymentUrl });
        }

        [HttpGet("PaymentCallBack")]
        public async Task<IActionResult> PaymentCallBack()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (response == null || response.VnPayResponseCode != "00")
            {
                return BadRequest(new { Message = "Payment failed" });
            }

            var paymentId = response.PaymentId; // Adjust based on your response model
            var payment = await _context.Payments.FindAsync(paymentId);

            if (payment == null)
            {
                return BadRequest(new { Message = $"Payment with id {paymentId} not found" });
            }

            payment.PaymentStatus = true;

            // Fetch the order associated with the payment
            var order = await _context.Orders.FindAsync(payment.OrderId);
            if (order == null)
            {
                return BadRequest(new { Message = $"Order with id {payment.OrderId} not found" });
            }

            // Update payment status and save changes
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();

            // Send the email using the _orderService (you'll need to implement this method in your OrderService)
            await _orderService.SendReceiptEmailAsync(order.MemberId, order); // Pass the member ID and order

            return Ok(new { Message = "Payment status updated successfully" });
        }
    }
}
