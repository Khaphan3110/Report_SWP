using Microsoft.AspNetCore.Http;
using SWPSolution.ViewModels.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Payment.VNPay
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(HttpContext context, VnPaymentResponseModel model);

        VnPaymentResponseModel PaymentExcuse(IQueryCollection collections);
    }
}
