import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Login/LoginForm.css";
import { Link } from "react-router-dom";
import { formik, useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { authenCodeOTP, authenEmailRegister } from "../../Service/UserService/UserService";
export default function SendEmailForm() {
  const navigator = useNavigate();
  const formik = useFormik({
    initialValues: {
      inputEmailForgot: "",
      codeGetFormEmail:"",
    },

    validationSchema: Yup.object({
      inputEmailForgot: Yup.string()
        .required("nhập email để lây lại mật khẩu!")
        .matches(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "vd: blabla@gmail.com"
        ),
        codeGetFormEmail: Yup.string().required("không được bỏ trống!").matches(/^\d{6}$/,"6 chữ số kh có khoảng trắng và kh có chữ cái"
        )
    }),

    onSubmit:async (values) => {
       const res = await authenCodeOTP(values.codeGetFormEmail)
       if(res.data.data){
        navigator("/ForgotPassword");
       } else {
        alert("email not exit!!");
       }
    },
  });

  const handleSendOTP = async () => {
    const res = await authenEmailRegister(formik.values.inputEmailForgot);
       if(res.data.data){
        alert("đã gửi mail")
        console.log(res.data)
       } else {
        alert("email not exit!!");
       }
  }

  return (
    <section className="L-seccion">
      <div className="container mx-auto">
        <div className="wraper-login-page">
          <div className="Header-login">
            <h1>Đăng Nhập</h1>
            <span>Bạn chưa có tài khoảng đăng nhập Đăng ký ?</span>
            <Link to={"/register"}>tại đây</Link>
          </div>
          <div className="row">
            <div className="wraper-form col-12 col-md-6 col-lg-5 offset-md-3 mx-auto">
              <div className="Forgot-form">
                <form onSubmit={formik.handleSubmit}>
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
                        value={formik.values.inputEmailForgot}
                        onChange={formik.handleChange}
                      ></input>
                      {formik.errors.inputEmailForgot && (
                      <p className="errorMsg">
                        {formik.errors.inputEmailForgot}
                      </p>
                    )}
                    </div>
                    
                    <div className="charactor-num-from-email">
                      <p onClick={handleSendOTP}>
                        Nhấn vào link này để gửi code? <a href="#">Gửi Code</a>
                      </p>
                    </div>
                    <div className="num-from-Email">
                      <input
                        type="text"
                        placeholder="code number"
                        name="codeGetFormEmail"
                      ></input>
                    </div>
                    <div className="b-forgot-login">
                      <button type="submit">
                        <p>Lấy Lại Mật Khẩu</p>
                      </button>
                    </div>
                    <div className="link-quaylai">
                      <p>
                        <Link to={"/login"}>Quay Lai</Link>
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
