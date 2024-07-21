using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.AppPayment;
using SWPSolution.Application.AppPayment.VNPay;
using SWPSolution.Application.Sales;
using SWPSolution.Data.Entities;
using SWPSolution.Data.Enum;
using SWPSolution.ViewModels.Payment;
using SWPSolution.ViewModels.Sales;
using System.Data;
using System.Data.Entity;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreOrderController : ControllerBase
    {
        private readonly SWPSolutionDBContext _context;
        private readonly IPaymentService _paymentService;
        private readonly IVnPayService _vnPayService;
        private readonly IPreOrderService _preOrderService;

        public PreOrderController(
            SWPSolutionDBContext context,
            IPaymentService paymentService,
            IVnPayService vnPayService,
            IPreOrderService preOrderService
            ) 
        {
            _context = context;
            _paymentService = paymentService;
            _vnPayService = vnPayService;
            _preOrderService = preOrderService;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreatePreOrder([FromBody] CreatePreOrderRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var preOrder = await _preOrderService.CreatePreOrder(model);
                return Ok(preOrder);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("availability")]
        public async Task<IActionResult> IsProductAvailable(string productId)
        {
            var isAvailable = await _preOrderService.IsProductAvailable(productId);
            return Ok(isAvailable);
        }

        [HttpPost("process-deposit")]
        public async Task<IActionResult> ProcessPreOrderDeposit([FromBody] PreOrderVM model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var payment = await _preOrderService.ProcessPreOrderDeposit(model.PreorderId, model.Total);
                return Ok(payment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{preorderId}")]
        public async Task<IActionResult> GetPreOrder(string preorderId)
        {
            var preOrder = await _preOrderService.GetPreOrder(preorderId);
            if (preOrder == null)
            {
                return NotFound(new { message = "No preorders were found" });
            }

            return Ok(preOrder);
        }
        [HttpGet("GetPreOrdersPaging")]
        public async Task<IActionResult> GetPreOrdersPaging([FromQuery] PreOrderPagingRequest request)
        {
            var result = await _preOrderService.GetPreOrdersPagingAsync(request);
            if (result == null || result.Items.Count == 0)
            {
                return NotFound(new { message = "No orders were found" });
            }
            return Ok(result);
        }

        [HttpGet("GetPreOrdersHistoryPaging")]
        public async Task<IActionResult> GetPreOrdersHistoryPaging([FromQuery] PreOrderHistoryPagingRequest request)
        {
            var result = await _preOrderService.GetPreOrdersHistoryPagingAsync(request);
            if (result == null || result.Items.Count == 0)
            {
                return NotFound(new { message = "No orders were found" });
            }
            return Ok(result);
        }

        [HttpGet("GetPreOrdersTrackingPaging")]
        public async Task<IActionResult> GetPreOrdersTrackingPaging([FromQuery] PreOrderTrackingPagingRequest request)
        {
            var result = await _preOrderService.GetPreOrdersTrackingPagingAsync(request);
            if (result == null || result.Items.Count == 0)
            {
                return NotFound(new { message = "No orders were found" });
            }
            return Ok(result);
        }

        [HttpGet("GetAllPreOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _preOrderService.GetAll();
            if (orders == null)
            {
                return NotFound(new { message = "No orders were found" });
            }
            return Ok(orders);
        }

        [HttpPut("{preorderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(string preorderId, PreOrderStatus status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _preOrderService.UpdateOrderStatus(preorderId, status);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("CheckoutVNPayPreOrder")]
        public async Task<IActionResult> CheckoutVNPayPreOrder([FromBody] PreOrderVM model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var preorder =  _context.Payments.FirstOrDefault(po => po.PreorderId == model.PreorderId);
            if (preorder == null)
            {
                throw new Exception("Preorder not found");
            }

            var payment = _context.Payments.FirstOrDefault(p => p.PreorderId == model.PreorderId);
            string paymentId = payment?.PaymentId;

            var vnPayModel = new VnPaymentRequestModel
            {
                Amount = model.Total,
                CreatedDate = model.PreorderDate,
                Description = $"{model.MemberId}",
                FullName = model.MemberId,
                OrderId = model.PreorderId,
                PaymentId = paymentId
            };

            var paymentRequest = new PaymentRequest
            {
                PreOrderId = model.PreorderId,
                Amount = model.Total,
                PaymentMethod = "VNPay",
                PaymentStatus = false,
                PaymentDate = DateTime.UtcNow
            };

            if (payment != null)
            {
                await _paymentService.Update(paymentId, paymentRequest);
            }
            else
            {
                await _paymentService.Create(paymentRequest);
            }

            var paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, vnPayModel);

            return Ok(new { PaymentUrl = paymentUrl });
        }

        [HttpPost("check-and-notify/{preorderId}")]
        public async Task<IActionResult> CheckAndNotify(string preorderId)
        {
            var checkResult = await _preOrderService.CheckPreOrderAsync(preorderId);

            if (checkResult == "Preorder not found")
            {
                return NotFound(new { message = checkResult });
            }

            if (checkResult == "Product is not yet available")
            {
                return Ok(new { message = checkResult });
            }

            var notifyResult = await _preOrderService.GeneratePaymentUrlAndNotifyAsync(preorderId, HttpContext);

            return Ok(new { message = notifyResult });
        }
    }
}
