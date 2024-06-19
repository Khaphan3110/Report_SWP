using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
<<<<<<< HEAD
       // string CreatePaymentUrl(HttpContext context, VnPaymentResponseModel model);
=======
        string CreatePaymentUrl(HttpContext context, VnPaymentRequestModel model);
>>>>>>> feature/order_controller

        VnPaymentResponseModel PaymentExecute([FromQuery] Dictionary<string, string> responseData);
    }
}
