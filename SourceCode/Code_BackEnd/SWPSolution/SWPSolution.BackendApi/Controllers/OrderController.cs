using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.Payment.VNPay;
using SWPSolution.Application.Sales;
using SWPSolution.Application.Session;
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

        public OrderController(IOrderService orderService, IConfiguration config, IVnPayService vnPayService, ISessionService sessionService)
        {
            _orderService = orderService;
            _config = config;
            _vnPayService = vnPayService;
            _sessionService = sessionService;
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

            return Ok(result.Order);
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
        [HttpPost]
        public IActionResult CheckoutVNPay([FromBody] OrderVM model)
        {
            if (ModelState.IsValid)
            {
                var vnPayModel = new VnPaymentRequestModel
                {
                    Amount = model.TotalAmount,
                    CreatedDate = model.OrderDate,
                    Description = $"{model.MemberId}",
                    FullName = model.MemberId,
                    OrderId = model.OrderId
                };

                var paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, vnPayModel);

                return Ok(new { PaymentUrl = paymentUrl });
            }

            return BadRequest(ModelState);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> PaymentCallBack([FromQuery] Dictionary<string, string> responseData)
        {
            using (StreamReader reader = new StreamReader(Request.Body))
            {
                
                var response = _vnPayService.PaymentExecute(responseData);

                if (response == null || response.VnPayResponseCode != "00")
                {
                    return BadRequest(new { Message = "Payment failed" });
                }

                return Ok(response);
            }
        }
        //[Authorize]
        //[HttpPost]
        //public async Task<IActionResult> Callback()
        //{
        //    // Get the full URL including query parameters
        //    string returnUrl = HttpContext.Request.GetDisplayUrl();

        //    // Parse the query string
        //    var queryDictionary = HttpUtility.ParseQueryString(new Uri(returnUrl).Query);

        //    // Create your VnPayCallbackData object
        //    var callbackData = new VnPayCallbackData
        //    {
        //        vnp_Amount = long.Parse(queryDictionary["vnp_Amount"]),
        //        vnp_BankCode = queryDictionary["vnp_BankCode"],
        //        vnp_CardType = queryDictionary["vnp_CardType"],
        //        vnp_OrderInfo = queryDictionary["vnp_OrderInfo"],
        //        vnp_PayDate = DateTime.ParseExact(queryDictionary["vnp_PayDate"], "yyyyMMddHHmmss", null), // Convert to DateTime
        //        vnp_ResponseCode = queryDictionary["vnp_ResponseCode"],
        //        vnp_SecureHash = queryDictionary["vnp_SecureHash"],
        //        vnp_TmnCode = queryDictionary["vnp_TmnCode"],
        //        vnp_TransactionNo = long.Parse(queryDictionary["vnp_TransactionNo"]),
        //        vnp_TransactionStatus = queryDictionary["vnp_TransactionStatus"],
        //        vnp_TxnRef = queryDictionary["vnp_TxnRef"]
        //    };

        //    if (callbackData.vnp_ResponseCode == "24") // Cancellation code
        //    {
        //        // 1. Retrieve order details (you'll need to find a way to identify the order)
        //        var order = await _orderService.GetOrderById(callbackData.vnp_TxnRef);

        //        // 2. Update order status to "Cancelled"
        //        await _orderService.UpdateOrderStatus(order.OrderId, OrderStatus.Canceled);

        //        // 3. (Optional) Log the cancellation event
        //    }
        //    return Ok();
        //}
    }
}
