using EShopBusinessObject;
using EShopDAOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EShopRepositories
{
    public class UserRepositories : IUserRepositories
    {
        private readonly UserDAO userDAO = null;
        public UserRepositories()
        {
            if(userDAO == null)
            {
                userDAO = new UserDAO();
            }
        }
        public User AddUser(User user)
        {
            return userDAO.AddUser(user);
        }

        public void DeleteUser(int id)
        {
            userDAO.DeleteUser(id);    
        }

        public User FindUserid(int id)
        {
            return userDAO.FindUserid(id);
        }
        public User GetUser(int id)
        {
            return userDAO.GetUser(id);
        }

        public List<User> GetUsers()
        {
            return userDAO.GetUsers();
        }

        public User UpdateUser(int id, User user)
        {
            return userDAO.UpdateUser(id, user);
        }
        public string GetLogin(string username, string password)
        {
            string response = userDAO.GetLogin(username, password);
            return response;
        }
    }
}
