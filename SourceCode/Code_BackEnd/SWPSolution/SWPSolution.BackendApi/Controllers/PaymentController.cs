using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.AppPayment;
using SWPSolution.Utilities.Exceptions;
using SWPSolution.ViewModels.Catalog.Categories;
using SWPSolution.ViewModels.Payment;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService) 
        {
            _paymentService = paymentService;
        }

        [HttpPost("CreatePayment")]
        public async Task<IActionResult> CreatePayment([FromForm] PaymentRequest request)
        {
            if( request == null)
            {
                string message = "The payment field is null";
                return BadRequest(message);
            }
            var result = await _paymentService.Create(request);
            return Ok(new { messsage = "New payment created successfully." });
        }

        [HttpPut("UpdatePayment/{id}/Payment")]
        public async Task<IActionResult> UpdatePayment(string id, PaymentRequest request)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _paymentService.Update(id, request);
            if (result == 0)
            {
                return BadRequest("Cannot update payment");
            }
            return Ok(result);
        }

        [HttpDelete("DeletePayment/{id}/Payment")]
        public async Task<IActionResult> DeletePayment(string id)
        {
            var result = await _paymentService.Delete(id);
            if (!result)
            {
                return NotFound(new { Message = "Payment not found." });
            }

            return Ok(new { Message = "Payment deleted successfully." });
        }

        [HttpGet("GetPayment/{id}/Payment")]
        public async Task<IActionResult> GetCategoryById(string id)
        {
            var payment = await _paymentService.GetById(id);
            if (payment == null)
            {
                return NotFound(new { Message = "Payment not found." });
            }

            return Ok(payment);
        }

        [HttpGet("GetAllPayment")]
        public async Task<IActionResult> GetAllPayments()
        {
            var categories = await _paymentService.GetAll();
            if (categories == null)
            {
                return NotFound(new { message = "No payment were found" });
            }
            return Ok(categories);
        }
    }
}
