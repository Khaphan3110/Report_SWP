﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.ViewModels.System.Users
{
    public class AddAddressRequest
    {
        public string House_Numbers { get; set; }
        public string Street_Name { get; set; }
        public string District_Name { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
    }
}
