using SWPSolution.Data.Entities;
using SWPSolution.ViewModels.Catalog.Blog;
using SWPSolution.ViewModels.System.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Application.System.Admin
{
    public interface IAdminService
    {
        Task<bool> RegisterAdmin(RegisterRequest request); 

        Task<bool> CreateBlogAsync(string staffId, BlogCreateRequest request);

        Task<List<Blog>> GetAllBlogsAsync();

        Task<BlogDetailVM> GetBlogByIdAsync(string staffId);

        Task<bool> UpdateBlogAsync(string staffId, UpdateBlogRequest request);

        Task<bool> DeleteBlogAsync(string blogId);
    }
}
