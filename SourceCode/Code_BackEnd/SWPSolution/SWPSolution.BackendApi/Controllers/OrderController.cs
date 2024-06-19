using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.Payment.VNPay;
using SWPSolution.Application.Sales;
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

        public OrderController(IOrderService orderService, IConfiguration config, IVnPayService vnPayService)
        {
            _orderService = orderService;
            _config = config;
            _vnPayService = vnPayService;
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
<<<<<<< HEAD
        public IActionResult PaymentCallBack()
        {
            return null;
        }

        //[HttpPost]
        //public IActionResult Checkout(OrderVM model)
        //{
          //  if (ModelState.IsValid)
            //{
                //var vnPayModel = new VnPaymentRequestModel
                //{
                    //Amount = model.TotalAmount,
                    //CreatedDate = model.OrderDate,
                  //  Description = $"{model.MemberId}",
                //    FullName = 
              //  };
           //     return Redirect(_vnPayService.CreatePaymentUrl(HttpContext, vnPayModel));
            //}
=======
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
>>>>>>> feature/order_controller
        }
    }

