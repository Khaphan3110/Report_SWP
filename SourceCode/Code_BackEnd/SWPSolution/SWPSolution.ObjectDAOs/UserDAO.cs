using EShopBusinessObject;
using EShopDAOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EShopDAOs
{
    public class UserDAO
    {
        private readonly TestUserDbContext dbContext = null;

        public UserDAO()
        {
            if (dbContext == null)
            {
                dbContext = new TestUserDbContext();
            }
        }
        public User GetUser(int id)
        {
            return dbContext.Users.SingleOrDefault(u => u.Id == id);
        }

        public List<User> GetUsers()
        {
            return dbContext.Users.ToList();
        }
        public User FindUserid(int id)
        {
            return dbContext.Users.FirstOrDefault(u => u.Id.Equals(id));
        }
        public User AddUser(User user)
        {
            dbContext.Users.Add(user);
            dbContext.SaveChanges();
            return user;
        }
        public User UpdateUser(int id, User user)
        {
            User user1 = FindUserid(id);
            if (user1 != null)
            {
                user1.Username = user.Username;
                user1.Password = user.Password;
                user1.Email = user.Email;
                dbContext.Users.Add(user1);
                dbContext.SaveChanges();
            }
            return user1;
        }
        public void DeleteUser(int id)
        {
            User user1 = FindUserid(id);
            if (user1 != null)
            {
                dbContext.Remove(user1);
                dbContext.SaveChanges();
            }

        }
        public string GetLogin(string username, string password)
        {
            User user = dbContext.Users.FirstOrDefault(u => u.Username == username && u.Password == password);

            if (user != null)
            {
                return "Logged in";
            }
            else
            {
                return "Login failed!!!";
            }
        }
    }
}
