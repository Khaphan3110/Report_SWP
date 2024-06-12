import "bootstrap/dist/css/bootstrap.min.css";
// import ReactDatePicker from "react-datepicker";
import { useFormik } from "formik";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { userRegister } from "../../../Service/UserService/UserService";
import "./RegisterForm.css";
export default function RegisterForm() {
  // const [selectDate, setSelectDate] = useState(null); //dùng cho ngày tháng
  const [typeInputForm, setTypeInputForm] = useState("password"); // dùng để thay đổi type của input pasword
  const listIcon = ["fa-solid fa-eye-slash", "fa-solid fa-eye"]; //icon eyeoff eye
  const [iconShow, setIconShow] = useState(["fa-solid fa-eye-slash"]); //set lại icon
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlerOnclickIcon = () => {
    if (typeInputForm === "password") {
      setTypeInputForm("text");
      setIconShow(listIcon[1]);
    } else {
      setTypeInputForm("password");
      setIconShow(listIcon[0]);
    }
  };

  // const handleOnchangeDate = (date) => {
  //   setSelectDate(date)
  // }

  const formik = useFormik({
    initialValues: {
      //thư viện dùng để chứa dữ liệu từ formik
      LastName: "",
      FirstName: "",
      Email: "",
      Password: "",
      UserName: "",
      ConfirmPassword: "",
      PhoneNumber: "",
      // newSelectDate: selectDate,
    },
    validationSchema: Yup.object({
      LastName: Yup.string()
        .required("không được bỏ trống họ!")
        .min(2, "phải lớn hơn 1 ký tự"),
      FirstName: Yup.string()
        .required("không được bỏ trống tên!")
        .min(2, "phải lớn hơn 1 ký tự"),
      Email: Yup.string()
        .required("không được bỏ trống Email!")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "vd: blabla@gmail.com"
        ),
      UserName: Yup.string()
        .required("Không được bỏ trống tên đăng nhập!")
        .matches(
          /^(?!.*\d)(?!.*\s)[A-Za-z]{7,}$/,
          "lơn hơn 7 ký tự,không có khoảng cách,kh chữ số"
        ),
      Password: Yup.string()
        .required("không được bỏ trống mật khẩu!")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[^\s]{8,}$/,
          "lớn hơn 7 ký tự ,1 chữ cái in hoa, 1 thường và 1 ký tự đặt biệt và 1 chữ số"
        ),
      ConfirmPassword: Yup.string()
        .required("không được bỏ trống xác nhận mật khẩu!")
        .oneOf([Yup.ref("Password"), null], "mật khẩu không trùng khớp"),
      PhoneNumber: Yup.string()
        .required("không được bỏ trống số điện thoại!")
        .matches(/^\d{10,}$/, "phải nhập chữ số kh được nhập ký tự"),
    }),

    onSubmit: async (values) => {
      const formdata = new FormData();
      formdata.append("FirstName", values.FirstName);
      formdata.append("LastName", values.LastName);
      formdata.append("Email", values.Email);
      formdata.append("PhoneNumber", values.PhoneNumber);
      formdata.append("UserName", values.UserName);
      formdata.append("Password", values.Password);
      formdata.append("ConfirmPassword", values.ConfirmPassword);
      alert("Tao");
      const reUserRegit = await userRegister(formdata);
      navigate("/authenOTP");
    },
  });

  // const sendEmailToGetOTP = async () => {
  //
  //   navigate("/authenOTP");
  // }
  // sendEmailToGetOTP();

  return (
    <section>
      <div className="container mx-auto">
        <div className="wrapper-register-page">
          <div className="header-register-page">
            <h1>ĐĂNG KÝ TÀI KHOẢN</h1>
            <span>Bạn đã có tài khoản ? Đăng nhập </span>
            <Link to={"/login"}>tại đây</Link>
          </div>
          <div className="row">
            <div className="wrapper-form-register col-12 col-md-6 col-lg-5 offset-md-3 mx-auto">
              <h4>Thông Tin Cá Nhân</h4>
              <form
                onSubmit={formik.handleSubmit}
                className="formRegister"
                method="post"
              >
                <div className="R-name">
                  <p>Họ</p>
                </div>
                <div className="register_input_place">
                  <input
                    type="text"
                    placeholder="Họ"
                    name="LastName"
                    value={formik.values.LastName}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.LastName && (
                    <p className="errosMsg">{formik.errors.LastName}</p>
                  )}
                </div>
                <div className="R-name">
                  <p>Tên</p>
                </div>
                <div className="register_input_place">
                  <input
                    type="text"
                    name="FirstName"
                    placeholder="Tên"
                    value={formik.values.FirstName}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.FirstName && (
                    <p className="errosMsg">{formik.errors.FirstName}</p>
                  )}
                </div>
                <div className="R-name">
                  <p>Email</p>
                </div>
                <div className="register_input_place">
                  <input
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={formik.values.Email}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.Email && (
                    <p className="errosMsg">{formik.errors.Email}</p>
                  )}
                </div>
                <div className="R-name">
                  <p>Tên đăng nhập</p>
                </div>
                <div className="register_input_place">
                  <input
                    type="text"
                    name="UserName"
                    placeholder="tên đăng nhâp "
                    value={formik.values.UserName}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.UserName && (
                    <p className="errosMsg">{formik.errors.UserName}</p>
                  )}
                </div>
                <div className="R-name">
                  <p>Mật Khẩu</p>
                </div>
                <div className="register_input_place">
                  <input
                    type={typeInputForm}
                    name="Password"
                    placeholder="mật khẩu"
                    value={formik.values.Password}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.Password && (
                    <p className="errosMsg">{formik.errors.Password}</p>
                  )}
                  <i className={iconShow} onClick={handlerOnclickIcon}></i>
                </div>
                <div className="R-name">
                  <p>Nhập Lại Mật Khẩu</p>
                </div>
                <div className="register_input_place">
                  <input
                    type={typeInputForm}
                    name="ConfirmPassword"
                    placeholder="nhập lại mật khẩu"
                    value={formik.values.ConfirmPassword}
                    onChange={formik.handleChange}
                  ></input>
                  <i className={iconShow} onClick={handlerOnclickIcon}></i>
                  {formik.errors.ConfirmPassword && (
                    <p className="errosMsg">{formik.errors.ConfirmPassword}</p>
                  )}
                </div>
                <div className="R-name">
                  <p>Số điện thoại</p>
                </div>
                <div className="register_input_place">
                  <input
                    type="text"
                    name="PhoneNumber"
                    placeholder="số điện thoại"
                    value={formik.values.PhoneNumber}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.PhoneNumber && (
                    <p className="errosMsg">{formik.errors.PhoneNumber}</p>
                  )}
                </div>
                {/* <div className="R-name">
                  <p>Ngày/tháng/năm sinh</p>
                </div>
                <div className="register_inputYear_place">
                  {
                    <ReactDatePicker
                      selected={selectDate}
                      onChange={handleOnchangeDate}
                      dateFormat={"dd/MM/yyyy"}
                      minDate={new Date("31/12/1900")}
                      maxDate={new Date()}
                      placeholderText="vd:20/10/2012"
                      className="input-year"
                      value={formik.values.newSelectDate}
                    />
                  }
                </div> */}
                <div className="b-Register">
                  <button type="submit">
                    <p>Đăng Ký</p>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
