using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.Sales;
using SWPSolution.ViewModels.Sales;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IConfiguration _config;

        public OrderController(IOrderService orderService, IConfiguration config)
        {
            _orderService = orderService;
            _config = config;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _orderService.PlaceOrderAsync(request);
            if (!success)
            {
                return Unauthorized();
            }

            return Ok();
        }
        [HttpGet("{orderId}")]
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
    }
}
