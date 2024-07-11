using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Data.Enum
{
    public enum OrderStatus
    {
        Canceled = -1,
        InProgress = 0,
        Confirmed = 1,
        Shipping = 2,
        Complete = 3
    }
}
