using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.Application.Gift;
using SWPSolution.ViewModels.Gift;

namespace SWPSolution.BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Route("api/[controller]")]
    public class GiftController : ControllerBase
    {
        private readonly IGiftService _giftService;

        public GiftController(IGiftService giftService)
        {
            _giftService = giftService;
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> PurchaseGift(GiftPurchaseRequest request)
        {
            try
            {
                var giftPurchase = await _giftService.PurchaseGiftAsync(request);
                return Ok(giftPurchase);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
