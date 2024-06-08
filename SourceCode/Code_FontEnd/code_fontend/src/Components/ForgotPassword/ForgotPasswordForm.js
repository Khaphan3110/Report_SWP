import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Login/LoginForm.css";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ForgotPasswordForm() {
  const [typeInputForm, setTypeInputForm] = useState("password");
  const listIcon = ["fa-solid fa-eye-slash", "fa-solid fa-eye"];
  const [iconShow, setIconShow] = useState(listIcon[0]);

  const handlerOnclickIcon = () => {
    if (typeInputForm === "password") {
      setTypeInputForm("text");
      setIconShow(listIcon[1]);
    } else {
      setTypeInputForm("password");
      setIconShow(listIcon[0]);
    }
  };

  const formik = useFormik({
    initialValues: {
      inputNewPassword: "",
      inputComfirmPassword: "",
    },

    validationSchema: Yup.object({
      inputNewPassword: Yup.string()
        .required("nhập mật khẩu mới")
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:,<.>]).{8,}$/,
          "Phải lớn hơn 7 lý tự và có 1 chữ cái in hoa và 1 ký tự đặt biệt"
        ),

      inputComfirmPassword: Yup.string()
        .required("nhập lại mật khẩu")
        .oneOf(
          [Yup.ref("inputNewPassword"), null],
          "mật khẩu không trùng khớp"
        ),
    }),

    onSubmit: (values) => {
      console.log(values);
      // Add logic to handle password reset here, such as calling an API
    },
  });

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
              <div className="Change-password-form">
                <form onSubmit={formik.handleSubmit}>
                  <fieldset>
                    <h2>Thay Đổi Mật Khẩu</h2>

                    <div className="charactor-new-password">
                      <p>Password</p>
                    </div>
                    <div className="Change-password-input-place">
                      <input
                        type={typeInputForm}
                        name="inputNewPassword"
                        placeholder="new password"
                        value={formik.values.inputNewPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <i className={iconShow} onClick={handlerOnclickIcon}></i>
                      {formik.touched.inputNewPassword && formik.errors.inputNewPassword && (
                        <p className="errorMsg">{formik.errors.inputNewPassword}</p>
                      )}
                    </div>
                    <div className="charactor-new-password">
                      <p>Confirm Password</p>
                    </div>
                    <div className="Change-password-input-place">
                      <input
                        type={typeInputForm}
                        name="inputComfirmPassword"
                        placeholder="mật khẩu mới"
                        value={formik.values.inputComfirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <i className={iconShow} onClick={handlerOnclickIcon}></i>
                      {formik.touched.inputComfirmPassword && formik.errors.inputComfirmPassword && (
                        <p className="errorMsg">{formik.errors.inputComfirmPassword}</p>
                      )}
                    </div>
                    <div className="b-forgot-login">
                      <button type="submit">
                        <p>Đổi Mật Khẩu</p>
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
