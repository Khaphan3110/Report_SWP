using Microsoft.AspNetCore.Http;

namespace SWPSolution.Application.Http
{
    public static class HttpContextHelper
    {
        public static HttpContext CreateHttpContext()
        {
            var context = new DefaultHttpContext();
            context.Request.Scheme = "https";
            context.Request.Host = new HostString("localhost:44358");
            return context;
        }
    }
}
