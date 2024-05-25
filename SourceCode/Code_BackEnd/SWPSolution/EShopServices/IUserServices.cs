using EShopBusinessObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EShopServices
{
    public interface IUserService
    {
        public User GetUser(int id);
        public List<User> GetUsers();
        public User FindUserid(int id);
        public User AddUser(User user);
        public User UpdateUser(int id, User user);
        public void DeleteUser(int id);
        public string GetLogin(string username, string password);
    }
}
