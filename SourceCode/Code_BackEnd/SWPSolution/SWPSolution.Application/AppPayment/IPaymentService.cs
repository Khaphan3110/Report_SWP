using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SWPSolution.Data.Entities; // Ensure this namespace is correct
using SWPSolution.ViewModels.Payment; // Adjust this namespace as needed

namespace SWPSolution.Application.AppPayment
{
    public interface IPaymentService
    {
        // Payment creation
        Task<string> Create(PaymentRequest request);

        // Payment updates
        Task<int> Update(string id, PaymentRequest request);

        // Payment deletion
        Task<bool> Delete(string id);

        // Payment retrieval
        Task<Payment> GetById(string id);
        Task<List<Payment>> GetAll();
    }
}
