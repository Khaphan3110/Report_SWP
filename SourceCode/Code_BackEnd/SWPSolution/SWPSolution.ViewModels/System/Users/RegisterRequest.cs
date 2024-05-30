using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SWPSolution.ViewModels.System.Users
{
    public class RegisterRequest
    {
        [Display(Name = "Tên")]
        public string FirstName { get; set; }

        [Display(Name = "Họ")]
        public string LastName { get; set; }

        [Display(Name = "Hòm thư")]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Display(Name = "Số điện thoại")]
        public string PhoneNumber { get; set; }

        [Display(Name = "Tài khoản")]
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }

        [Display(Name = "Mật khẩu")]
        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Xác nhận mật khẩu")]
        [Required(ErrorMessage = "You must re enter the password")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}