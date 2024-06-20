using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Payment
{
    public interface IPaymentService
    {
        Task<string> Create(PaymentRequest request);
        Task<int> Update(string id, PaymentRequest request);
        Task<bool> Delete(string id);
        Task<PaymentRequest> GetById (string id);
        Task<List<PaymentVM>> GetAll();
    }
}
