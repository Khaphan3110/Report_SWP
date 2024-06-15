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

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("place-order")]
        [AllowAnonymous]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderRequest orderRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var memberId = await _orderService.ExtractMemberIdFromTokenAsync(orderRequest.Token);
            if (string.IsNullOrEmpty(memberId))
            {
                return BadRequest("Invalid token or member not found.");
            }

            // Additional validation and processing can be added here

            var success = await _orderService.PlaceOrderAsync(orderRequest);
            if (!success)
            {
                return BadRequest("Failed to place order.");
            }

            return Ok(new { message = "Order placed successfully" });
        }
    }
}
