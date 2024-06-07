import "bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import "../Login/LoginForm.css";
import { authenCodeOTP, authenEmailRegister } from "../../Service/UserService/UserService"; 
export default function AuthenEmail() {
  const navigator = useNavigate();
  const emailUser = useParams();
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
      console.log("OTP",resUserOTP)
    },
  });
  useEffect(() => {
    async function fetchData() {
      const reSendEmail = await authenEmailRegister(emailUser);
      if (reSendEmail) {
        console.log(reSendEmail);
      }
    }
    fetchData();
  }, []);

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
                <form method="get" onSubmit={formik.handleSubmit}>
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
                      ></input>
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
