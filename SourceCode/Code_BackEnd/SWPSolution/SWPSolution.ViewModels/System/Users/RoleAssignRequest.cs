using SWPSolution.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.System.Users
{
    public class RoleAssignRequest
    {
        public string memberId {  get; set; }
        public Guid Id { get; set; }
        public SelectItem[] Roles { get; set; }
    }
}