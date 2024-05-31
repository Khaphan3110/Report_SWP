import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Login/LoginForm.css";
import { Link } from "react-router-dom";
import { formik, useFormik } from "formik";
import * as Yup from "yup";

export default function ForgotPasswordForm() {
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
    },
  });

  return (
    <div className="Change-password-form">
      <form onSubmit={formik.handleChange}>
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
            ></input>
            <i className={iconShow} onClick={handlerOnclickIcon}></i>
            {formik.errors.inputNewPassword && (
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
            ></input>
            <i className={iconShow} onClick={handlerOnclickIcon}></i>
            {formik.errors.inputComfirmPassword && (
              <p className="errorMsg">{formik.errors.inputComfirmPassword}</p>
            )}
          </div>
          <div className="b-forgot-login">
            <button>
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
  );
}
