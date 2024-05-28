import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css";

export default function LoginForm() {
  const [typeInputForm, setTypeInputForm] = useState("password");
  const listIcon = ["fa-solid fa-eye-slash", "fa-solid fa-eye"];
  const [iconShow, setIconShow] = useState(["fa-solid fa-eye-slash"]);

  const handlerOnclickIcon = () => {
    if (typeInputForm === "password") {
      setTypeInputForm("text");
      setIconShow(listIcon[1]);
    } else {
      setTypeInputForm("password");
      setIconShow(listIcon[0]);
    }
  };

  const pageLoginForm = document.querySelector(".L-form");
  const pageForgotWithEmail = document.querySelector(".Forgot-form");
  const pageChangePassword = document.querySelector(".Change-password-form");
  
  const HandleLogin = () => {
    var pageLoginForm = document.querySelector(".L-form");
    pageLoginForm.style.display = "none";
  };

  const HanleShowLoginpage = () => {
    const pageLoginForm = document.querySelector(".L-form");
    const pageForgotWithEmail = document.querySelector(".Forgot-form");
    const pageChangePassword = document.querySelector(".Change-password-form");
    pageLoginForm.style.display = "block";
    pageForgotWithEmail.style.display = "none";
    pageChangePassword.style.display = "none";
  }

  const HandleShowEmailForm = () => {
    const pageLoginForm = document.querySelector(".L-form");
    const pageForgotWithEmail = document.querySelector(".Forgot-form");
    const pageChangePassword = document.querySelector(".Change-password-form");
    pageLoginForm.style.display = "none";
    pageForgotWithEmail.style.display = "block";
    pageChangePassword.style.display = "none";
  }

  const HandleShowChangePasswordPage = () => {
    const pageLoginForm = document.querySelector(".L-form");
    const pageForgotWithEmail = document.querySelector(".Forgot-form");
    const pageChangePassword = document.querySelector(".Change-password-form");
    pageLoginForm.style.display = "none";
    pageForgotWithEmail.style.display = "none";
    pageChangePassword.style.display = "block";
  }

  return (
    <section className="L-seccion">
      <div className="container mx-auto">
        <div className="wraper-login-page">
          <div className="Header-login">
            <h1>Đăng Nhập</h1>
            <span>Bạn chưa có tài khoảng đăng nhập Đăng ký ?</span>
            <a href="#">Tại Đây</a>
          </div>
          <div className="row">
            <div className="wraper-form col-12 col-md-6 col-lg-5 offset-md-3 mx-auto">
              <div className="L-form">
                <form method="post" action="">
                  <div>
                    <p>
                      Email <span>*</span>
                    </p>
                    <div className="L-input-place">
                      <input
                        type="text"
                        name="UserEmail"
                        placeholder="Input your email"
                      ></input>
                    </div>
                  </div>
                  <p>
                    password <span>*</span>
                  </p>
                  <div className="L-input-place">
                    <input
                      type={typeInputForm}
                      name="password"
                      placeholder="Input your password"
                    ></input>
                    <i className={iconShow} onClick={handlerOnclickIcon}></i>
                  </div>
                  <div className="link-Fogot-password">
                    <p>quên mật khẩu ? </p>
                    <a href="#" onClick={HandleShowEmailForm}>Nhấn Vào Đây</a>
                  </div>
                  <div className="b-form-login" onClick={HandleLogin}>
                    <button type="submit">
                      <p>Đăng Nhập</p>
                    </button>
                  </div>
                  <hr></hr>
                  <div className="b-form-login-google">
                    <button type="submit">
                      <p>Đăng nhập Google</p>
                    </button>
                    <i className="fa-brands fa-google"></i>
                  </div>
                </form>
              </div>
              <div className="Forgot-form">
                <form>
                  <fieldset>
                    <h2>Đặt Lại Mật Khẩu</h2>
                    <h6>
                      Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt
                      lại mật khẩu.
                    </h6>
                    <div className="Forgot-input-place">
                      <input
                        type="text"
                        name="inputEmailForgot"
                        placeholder="Email"
                      ></input>
                    </div>
                    <div className="b-forgot-login" onClick={HandleShowChangePasswordPage}>
                      <button type="submit">
                        <p>Lấy Lại Mật Khẩu</p>
                      </button>
                    </div>
                    <div className="link-quaylai">
                      <p>
                        <a href="#" onClick={HanleShowLoginpage}>Quay Lai</a>
                      </p>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div className="Change-password-form">
                <form>
                  <fieldset>
                    <h2>Thay Đổi Mật Khẩu</h2>
                    <div className="charactor-num-from-email">
                      <p>Code</p>
                    </div>
                    <div className="num-from-Email">
                       <input type="text" placeholder="code number" name="codeGetFormEmail"></input>
                    </div>
                    <div className="charactor-new-password">
                      <p>Password</p>
                    </div>
                    <div className="Change-password-input-place">
                      <input
                        type={typeInputForm}
                        name="inputNewPassword"
                        placeholder="new password"
                        required
                      ></input>
                      <i className={iconShow} onClick={handlerOnclickIcon}></i>
                    </div>
                    <div className="charactor-new-password">
                      <p>Confirm Password</p>
                    </div>
                    <div className="Change-password-input-place">
                      <input
                        type={typeInputForm}
                        name="inputComfirmPassword"
                        required
                      ></input>
                      <i className={iconShow} onClick={handlerOnclickIcon}></i>
                    </div>
                    <div className="b-forgot-login">
                      <button >
                        <p>Đổi Mật Khẩu</p>
                      </button>
                    </div>
                    <div className="link-quaylai">
                      <p>
                        <a href="#" onClick={HanleShowLoginpage}>Quay Lai</a>
                      </p>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
