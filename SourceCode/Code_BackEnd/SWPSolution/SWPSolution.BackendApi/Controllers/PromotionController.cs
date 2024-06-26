using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.Catalog.Promotion;
using SWPSolution.ViewModels.Catalog.Promotion;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionService _promotionService;

        public PromotionController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var promotions = await _promotionService.GetAll();
            return Ok(promotions);
        }

        [HttpGet("{promotionId}")]
        public async Task<IActionResult> GetById(string promotionId)
        {
            var promotion = await _promotionService.GetById(promotionId);
            if (promotion == null)
                return NotFound();
            return Ok(promotion);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PromotionCreateRequest request)
        {
            try
            {
                var promotionId = await _promotionService.Create(request);
                return CreatedAtAction(nameof(GetById), new { promotionId }, new { promotionId });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Log error and return a more detailed error message in a real-world scenario
            }
        }

        [HttpPost("create-multiple")] // New endpoint for multiple creation
        public async Task<IActionResult> CreateMultiplePromotions([FromBody] List<PromotionCreateRequest> requests)
        {
            try
            {
                var promotionIds = await _promotionService.CreateMultiplePromotions(requests);
                return CreatedAtAction(nameof(GetAll), promotionIds);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("{promotionId}")]
        public async Task<IActionResult> Update(string promotionId, [FromBody] PromotionUpdateRequest request)
        {
            var isSuccessful = await _promotionService.Update(promotionId, request);
            if (isSuccessful)
                return NoContent();
            return NotFound();
        }

        [HttpDelete("{promotionId}")]
        public async Task<IActionResult> Delete(string promotionId)
        {
            var isSuccessful = await _promotionService.Delete(promotionId);
            if (isSuccessful)
                return NoContent();
            return NotFound();
        }
    }
}
