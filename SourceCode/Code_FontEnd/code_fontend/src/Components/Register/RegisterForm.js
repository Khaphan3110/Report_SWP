import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegisterForm.css";
import LoginForm from "../Login/LoginForm";
export default function RegisterForm() {
  return (
    <session>
      <div className="container mx-auto">
        <div className="wrapper-register-page">
          <div className="header-register-page">
            <h1>ĐĂNG KÝ TÀI KHOẢN</h1>
            <span>Bạn đã có tài khoản ? Đăng nhập </span>
            <a href={<LoginForm />}>tại đây</a>
          </div>
          <div className="row">
            <div className="wrapper-form-register col-12 col-md-6 col-lg-5 offset-md-3 mx-auto">
              <h4>Thông Tin Cá Nhân</h4>
              <form>
                <div className="R-name">
                  <p>Họ</p>
                </div>
                <div className="register_input_place">
                  <input type="text" placeholder="Họ" name="Lname"></input>
                </div>
                <div className="R-name">
                  <p>Tên</p>
                </div>
                <div className="register_input_place">
                  <input type="text" name="Fname" placeholder="Tên">             
                  </input>
                </div>
                <div className="R-name">
                  <p>Email</p>
                </div>
                <div className="register_input_place">
                  <input type="text" name="Remail" placeholder="Email">             
                  </input>
                </div>
                <div className="R-name">
                  <p>Mật Khẩu</p>
                </div>
                <div className="register_input_place">
                  <input type="text" name="Pemail" placeholder="mật khẩu">             
                  </input>
                </div>
                <div className="R-name">
                  <p>Nhập Lại Mật Khẩu</p>
                </div>
                <div className="register_input_place">
                  <input type="text" name="Pemail" placeholder="nhập lại mật khẩu">             
                  </input>
                </div>
                <div className="R-name">
                  <p>Số điện thoại</p>
                </div>
                <div className="register_input_place">
                  <input type="text" name="Pnumber" placeholder="số điện thoại">             
                  </input>
                </div>
                <div className="R-name">
                  <p>Ngày/tháng/năm sinh</p>
                </div>
                <div className="register_input_place">
                  <input type="text" name="DOB" placeholder="">             
                  </input>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </session>
  );
}
