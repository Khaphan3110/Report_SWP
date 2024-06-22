using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.Payment
{
    public class VnPayCallbackData
    {
        public long vnp_Amount { get; set; }
        public string vnp_BankCode { get; set; }
        public string vnp_OrderInfo { get; set; }
        public DateTime vnp_PayDate { get; set; }
        public string vnp_ResponseCode { get; set; }
        public string vnp_SecureHash { get; set; } // For validation
        public string vnp_TmnCode { get; set; }
        public long vnp_TransactionNo { get; set; }
        public string vnp_TransactionStatus { get; set; }
        public string vnp_TxnRef { get; set; } // Use this to link to your order

        // Optional Parameters (Might not be present in all callbacks)
        public string? vnp_CardType { get; set; }
    }
}
