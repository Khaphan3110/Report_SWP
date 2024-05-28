using System;
using System.Collections.Generic;
using System.Text;

namespace SWPSolution.Utilities.Exceptions
{
    public class SWPException : Exception
    {
        public SWPException()
        { 

        }
        public SWPException(string message) : base(message) 
        {

        }
        public SWPException(string message, Exception inner): base(message, inner)
        {

        }
    }
}
