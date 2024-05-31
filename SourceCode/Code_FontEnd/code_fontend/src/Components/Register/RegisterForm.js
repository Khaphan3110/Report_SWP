
import "bootstrap/dist/css/bootstrap.min.css";
// import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RegisterForm.css";
import LoginForm from "../Login/LoginForm";
import { compareAsc } from "date-fns";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Routes,
} from "react-router-dom";
import { useFormik } from "formik"
import * as Yup from "yup";


export default function RegisterForm() {
  const [selectDate, setSelectDate] = useState(null); //dùng cho ngày tháng
  const [typeInputForm, setTypeInputForm] = useState("password"); // dùng để thay đổi type của input pasword
  const listIcon = ["fa-solid fa-eye-slash", "fa-solid fa-eye"]; //icon eyeoff eye
  const [iconShow, setIconShow] = useState(["fa-solid fa-eye-slash"]); //set lại icon
  
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
    initialValues: {//thư viện dùng để chứa dữ liệu từ formik
      Lname:"",
      Fname:"",
      Email:"",
      password:"",
      confirmPassword:"",
      phone:"",
      // newSelectDate: selectDate,

    },
    validationSchema:Yup.object({
      Lname: Yup.string().required("không được bỏ trống họ!").min(2,"phải lớn hơn 1 ký tự"),
      Fname: Yup.string().required("không được bỏ trống tên!").min(2,"phải lớn hơn 1 ký tự"),
      Email: Yup.string().required("không được bỏ trống Email!").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"vd: blabla@gmail.com"),
      password: Yup.string().required("không được bỏ trống mật khẩu!").matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:,<.>]).{8,}$/,"Phải lớn hơn 7 lý tự và có 1 chữ cái in hoa và 1 ký tự đặt biệt"),
      confirmPassword: Yup.string().required("không được bỏ trống xác nhận mật khẩu!").oneOf([Yup.ref("password"),null],"mật khẩu không trùng khớp"),
      phone: Yup.string().required("không được bỏ trống số điện thoại!").matches(/^\d{10,}$/,"phải nhập chữ số kh được nhập ký tự"),
      
    }),

    onSubmit:(values) => {
      console.log(values)
    }

  })
  
  
  console.log(formik.values)
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
              <form onSubmit={formik.handleSubmit} className="formRegister">
                <div className="R-name">
                  <p>Họ</p>
                </div>
                <div className="register_input_place">
                  <input
                    type="text"
                    placeholder="Họ"
                    name="Lname"
                    value={formik.values.Lname}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.Lname && (<p className="errosMsg" >{formik.errors.Lname}</p>)}
                </div>
                <div className="R-name">
                  <p>Tên</p>
                </div>
                <div className="register_input_place">
                  <input
                    type="text"
                    name="Fname"
                    placeholder="Tên"
                    value={formik.values.Fname}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.Fname && (<p className="errosMsg" >{formik.errors.Fname}</p>)}
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
                  {formik.errors.Email && (<p className="errosMsg" >{formik.errors.Email}</p>)}
                </div>
                <div className="R-name">
                  <p>Mật Khẩu</p>
                </div>
                <div className="register_input_place">
                  <input
                    type={typeInputForm}
                    name="password"
                    placeholder="mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.password && (<p className="errosMsg" >{formik.errors.password}</p>)}
                  <i className={iconShow} onClick={handlerOnclickIcon}></i>
                </div>
                <div className="R-name">
                  <p>Nhập Lại Mật Khẩu</p>
                </div>
                <div className="register_input_place">
                  <input
                    type={typeInputForm}
                    name="confirmPassword"
                    placeholder="nhập lại mật khẩu"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                  ></input>  
                  <i className={iconShow} onClick={handlerOnclickIcon}></i>
                  {formik.errors.confirmPassword && (<p className="errosMsg" >{formik.errors.confirmPassword}</p>)}
                </div>
                <div className="R-name">
                  <p>Số điện thoại</p>
                </div>
                <div className="register_input_place">
                  <input
                    type="text"
                    name="phone"
                    placeholder="số điện thoại"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  ></input>
                  {formik.errors.phone && (<p className="errosMsg" >{formik.errors.phone}</p>)}
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
