import "bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import "../Login/LoginForm.css";
import { authenCodeOTP } from "../../../Service/UserService/UserService";
import { ToastContainer, toast } from "react-toastify";
import "./AuthenEmail.css";
export default function AuthenEmail() {
  const navigator = useNavigate();

  const formik = useFormik({
    initialValues: {
      codeGetFormEmail: "",
    },

    validationSchema: Yup.object({
      codeGetFormEmail: Yup.string()
        .required("nhập OTP để hoàn tất đăng ký")
        .matches(/^\d{6}$/, "là số và lớn hơn 5 chữ số!"),
    }),

    onSubmit: async (values) => {
      const resUserOTP = await authenCodeOTP(values.codeGetFormEmail);
      if (resUserOTP) {
        if (resUserOTP.data.message == "Email confirmed successfully") {
          toast.success(
            "Bạn đã đăng ký thành công tiến hành đăng nhập thôi nào"
          );
          navigator("/login");
        } else {
          alert("mạng yếu đợi xíu");
        }
      } else {
        toast.error("OTP kh đúng rồi")
      }
    },
  });

  return (
    <section className="L-seccion">
      <ToastContainer />
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
                    <h2>Nhập OPT nhận từ email để hoàn tất đăng ký</h2>
                    <h6>
                      Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc tạo
                      mới tài khoản.
                    </h6>
                    <div className="num-from-Email">
                      <input
                        type="text"
                        placeholder="code number"
                        name="codeGetFormEmail"
                        id="codeGetFormEmail"
                        value={formik.values.codeGetFormEmail}
                        onChange={formik.handleChange}
                      ></input>
                      {formik.errors.codeGetFormEmail && (
                        <p style={{ color: "red" }}>
                          {formik.errors.codeGetFormEmail}
                        </p>
                      )}
                    </div>
                    <div className="b-forgot-login">
                      <button type="submit">
                        <p>Xác thực</p>
                      </button>
                    </div>
                  </fieldset>
                </form>
                <div className="link-quaylai">
                  <p>
                    <Link to={"/login"}>Quay Lai</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
