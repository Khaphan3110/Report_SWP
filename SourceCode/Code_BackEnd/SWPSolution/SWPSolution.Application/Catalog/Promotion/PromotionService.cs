using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Promotion;

namespace SWPSolution.Application.Catalog.Promotion
{
    public class PromotionService : IPromotionService
    {
        private readonly SWPSolutionDBContext _context;

        public PromotionService(SWPSolutionDBContext context)
        {
            _context = context;
        }

        public async Task<string> Create(PromotionCreateRequest request)
        {
            var promotion = new Data.Entities.Promotion()
            {
                PromotionId = GeneratePromotionId(),
                Name = request.Name,
                DiscountType = request.DiscountType,
                DiscountValue = request.DiscountValue,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
            };
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            var insertedPromotion = _context.Promotions.FirstOrDefault(p => p.Name == request.Name && p.DiscountType == request.DiscountType);

            if (insertedPromotion == null || string.IsNullOrEmpty(insertedPromotion.PromotionId))
            {
                throw new Exception("Failed to retrieve the newly inserted promotion from the database.");
            }
            return insertedPromotion.PromotionId;
        }

        public async Task<List<string>> CreateMultiplePromotions(List<PromotionCreateRequest> requests)
        {
            var promotionReturn = new List<string>();

            foreach (var request in requests)
            {
                string generatedId = GeneratePromotionId();
                var promotion = new Data.Entities.Promotion
                {
                    Name = request.Name,
                    DiscountType = request.DiscountType,
                    DiscountValue = request.DiscountValue,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                };
                _context.Promotions.Add(promotion);
                await _context.SaveChangesAsync();

                var insertedPromotion = await _context.Promotions.FirstOrDefaultAsync(p => p.PromotionId == generatedId);

                if (insertedPromotion == null)
                {
                    throw new InvalidOperationException("Failed to retrieve inserted promotion.");
                }

                promotionReturn.Add(insertedPromotion.PromotionId);
            }

            return promotionReturn;
        }

        public async Task<bool> Delete(string promotionId)
        {
            var promotion = await _context.Promotions.FindAsync(promotionId);
            if (promotion == null)
                return false;
            _context.Promotions.Remove(promotion);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PromotionVM>> GetAll()
        {
            return _context.Promotions
                .Select(p => new PromotionVM
                {
                    PromotionId = p.PromotionId,
                    Name = p.Name,
                    DiscountType = p.DiscountType,
                    DiscountValue = p.DiscountValue,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                })
                .ToList();
        }

        public async Task<PromotionVM> GetById(string promotionId)
        {
            var promotion = await _context.Promotions.FindAsync(promotionId);
            if (promotion == null) return null;

            return new PromotionVM
            {
                PromotionId = promotion.PromotionId,
                Name = promotion.Name,
                DiscountType = promotion.DiscountType,
                DiscountValue = promotion.DiscountValue,
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
            };
        }

        public async Task<bool> Update(string promotionId, PromotionUpdateRequest request)
        {
            var promotion = await _context.Promotions.FindAsync(promotionId);
            if (promotion == null) return false;

            promotion.Name = request.Name;
            promotion.DiscountType = request.DiscountType;
            promotion.DiscountValue = request.DiscountValue;
            promotion.StartDate = request.StartDate;
            promotion.EndDate = request.EndDate;

            _context.Promotions.Update(promotion);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int?> GetDiscountValueByPromotionId(string promotionId)
        {
            var promotion =  _context.Promotions.FirstOrDefault(p => p.PromotionId == promotionId);
            return promotion?.DiscountValue;
        }

        private string GeneratePromotionId()
        {
            string month = DateTime.Now.ToString("MM");
            string year = DateTime.Now.ToString("yy");

            int autoIncrement = GetNextAutoIncrement(month, year);

            string formattedAutoIncrement = autoIncrement.ToString().PadLeft(3, '0');

            return $"PR{month}{year}{formattedAutoIncrement}";
        }

        private int GetNextAutoIncrement(string month, string year)
        {
            string pattern = $"PR{month}{year}";

            var maxAutoIncrement = _context.Promotions
                .Where(c => c.PromotionId.StartsWith(pattern))
                .Select(c => c.PromotionId.Substring(6, 3))
                .AsEnumerable()
                .Select(s => int.Parse(s))
                .DefaultIfEmpty(0)
                .Max();

            return maxAutoIncrement + 1;
        }
    }
}
