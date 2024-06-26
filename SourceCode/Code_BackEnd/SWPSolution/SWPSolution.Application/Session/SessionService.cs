using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SWPSolution.Application.Session
{
    public class SessionService : ISessionService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SessionService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public void SetString(string key, string value)
        {
            _httpContextAccessor.HttpContext?.Session.SetString(key, value);
        }

        public string? GetString(string key)
        {
            return _httpContextAccessor.HttpContext?.Session.GetString(key);
        }

        public void Remove(string key)
        {
            _httpContextAccessor.HttpContext?.Session.Remove(key);
        }
    }
}
