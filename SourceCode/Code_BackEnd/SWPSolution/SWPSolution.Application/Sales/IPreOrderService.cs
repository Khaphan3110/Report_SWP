using SWPSolution.ViewModels.Sales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Sales
{
    public interface IPreOrderService
    {
        Task<bool> Create(PreOrderRequest request);


    }
}
