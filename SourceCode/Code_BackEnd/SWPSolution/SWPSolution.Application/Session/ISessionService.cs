using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.Session
{
    public interface ISessionService
    {
        void SetString(string key, string value);
        string? GetString(string key);
        void Remove(string key);
    }
}
