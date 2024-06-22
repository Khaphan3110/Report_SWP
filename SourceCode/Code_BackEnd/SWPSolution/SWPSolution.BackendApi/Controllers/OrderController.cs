using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SWPSolution.Application.Sales;
using SWPSolution.ViewModels.Sales;
using SWPSolution.ViewModels.System.Users;

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

        [HttpPost("AddReview")]
        public async Task<IActionResult> AddReview([FromQuery] string jwtToken, [FromBody] AddReviewRequest request)
        {
            if (string.IsNullOrEmpty(jwtToken))
            {
                return BadRequest(new { message = "Token is required." });
            }

            try
            {
                var memberId = await _orderService.ExtractMemberIdFromTokenAsync(jwtToken);
                if (memberId == null)
                {
                    return BadRequest(new { message = "Invalid token." });
                }

                var result = await _orderService.AddReview(memberId, request);
                if (!result)
                {
                    return NotFound(new { message = "Member or Product not found" });
                }

                return Ok(new { message = "Review added successfully" });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("DeleteReview")]
        public async Task<IActionResult> DeleteReview([FromBody] string jwtToken, string productId)
        {
            if (string.IsNullOrEmpty(jwtToken))
            {
                return BadRequest(new { message = "Token is required." });
            }

            try
            {
                var memberId = await _orderService.ExtractMemberIdFromTokenAsync(jwtToken);

                var result = await _orderService.DeleteReview(memberId, productId);
                if (!result)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(new { message = "Review deleted successfully" });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
