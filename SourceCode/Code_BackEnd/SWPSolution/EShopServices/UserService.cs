using EShopBusinessObject;
using EShopDAOs;
using EShopRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EShopServices
{
    public class UserService : IUserService
    {
        private readonly IUserRepositories userRepository = null;
        public UserService()
        {
            if (userRepository == null)
            {
                userRepository = new UserRepositories();
            }
        }
        public User AddUser(User user)
        {
            return userRepository.AddUser(user);
        }

        public void DeleteUser(int id)
        {
            userRepository.DeleteUser(id);
        }

        public User FindUserid(int id)
        {
            return userRepository.FindUserid(id);
        }
        public User GetUser(int id)
        {
            return userRepository.GetUser(id);
        }
        public List<User> GetUsers()
        {
            return userRepository.GetUsers();
        }

        public User UpdateUser(int id, User user)
        {
            return userRepository.UpdateUser(id, user);
        }
        public string GetLogin(string username, string password)
        {
            string response = userRepository.GetLogin(username, password);
            return response;
        }
    }
}
