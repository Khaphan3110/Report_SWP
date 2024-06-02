import "bootstrap/dist/css/bootstrap.min.css";
// import ReactDatePicker from "react-datepicker";
import { useFormik } from "formik";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  Link,
  useNavigate
} from "react-router-dom";
import * as Yup from "yup";
import "./RegisterForm.css";
import axious from "axios"
export default function RegisterForm() {
  const [selectDate, setSelectDate] = useState(null); //dùng cho ngày tháng
  const [typeInputForm, setTypeInputForm] = useState("password"); // dùng để thay đổi type của input pasword
  const listIcon = ["fa-solid fa-eye-slash", "fa-solid fa-eye"]; //icon eyeoff eye
  const [iconShow, setIconShow] = useState(["fa-solid fa-eye-slash"]); //set lại icon
  const navigateHome = useNavigate();
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
      UserName: Yup.string().required("Không được bỏ trống tên đăng nhập!"),
      Password: Yup.string()
        .required("không được bỏ trống mật khẩu!")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,$/,
          "Phải lớn hơn 7 lý tự và có 1 chữ cái in hoa và 1 ký tự đặt biệt và 1 chữ số"
        ),
      ConfirmPassword: Yup.string()
        .required("không được bỏ trống xác nhận mật khẩu!")
        .oneOf([Yup.ref("password"), null], "mật khẩu không trùng khớp"),
      PhoneNumber: Yup.string()
        .required("không được bỏ trống số điện thoại!")
        .matches(/^\d{10,}$/, "phải nhập chữ số kh được nhập ký tự"),
    }),

    onSubmit: (values) => {
      axious.post(("https://localhost:44319/api/Users/register")).then((res) => {
        if(res) {
          navigateHome("/");
        }
      }).catch((error) => {
          console.log("There have something wrong when post data!",error);
      })
    },
  });

  console.log(formik.values);
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
              <form onSubmit={formik.handleSubmit} className="formRegister" method="post">
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
