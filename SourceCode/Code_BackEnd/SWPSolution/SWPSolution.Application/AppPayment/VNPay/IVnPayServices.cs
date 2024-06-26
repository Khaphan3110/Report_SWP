using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWPSolution.ViewModels.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.AppPayment.VNPay
{
    public interface IVnPayService
    {

        string CreatePaymentUrl(HttpContext context, VnPaymentRequestModel model);

        public VnPaymentResponseModel PaymentExecute(IQueryCollection collections);
    }
}
