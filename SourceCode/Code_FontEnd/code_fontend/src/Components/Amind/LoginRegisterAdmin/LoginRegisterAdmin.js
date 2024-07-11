import React, { useState } from "react";
import "./LoginRegisterAdmin.css";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaAddressCard,
  FaLockOpen,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import {
  AdminLogin,
  AdminRegister,
  GetAdminInforMation,
} from "../../../Service/AdminService/AdminService";
import { useAdminProfile } from "../../../Store/Hooks/Hooks";
const LoginRegisterAdmin = () => {
  const [action, setAction] = useState("");
  const navigator = useNavigate();
  const { getAdminProfile, updateAdminToken } = useAdminProfile();
  const registerAdmin = (e) => {
    e.preventDefault();
    setAction("active");
  };

  const loginLink = (e) => {
    e.preventDefault();
    setAction("");
  };

  const formik = useFormik({
    initialValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      PhoneNumber: "",
      UserName: "",
      Password: "",
      ConfirmPassword: "",
    },

    validationSchema: Yup.object({
      LastName: Yup.string()
        .required("LastName cannot be left blank!")
        .min(2, "must be greater than 1 character"),
      FirstName: Yup.string()
        .required("Names cannot be left blank!")
        .min(2, "must be greater than 1 character"),
      Email: Yup.string()
        .required("Email cannot be left blank!")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "vd: blabla@gmail.com"
        ),
      UserName: Yup.string()
        .required("Do not leave your username blank!")
        .matches(
          /^(?!.*\d)(?!.*\s)[A-Za-z]{7,}$/,
          "Greater than 7 characters, no spaces, no digits"
        ),
      Password: Yup.string()
        .required("Do not leave the password blank!")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[^\s]{8,}$/,
          "greater than 7 characters, 1 uppercase letter, 1 lowercase letter, 1 special character and 1 number"
        ),
      ConfirmPassword: Yup.string()
        .required("Do not leave confirm password blank!")
        .oneOf([Yup.ref("Password"), null], "Passwords do not match"),
      PhoneNumber: Yup.string()
        .required("Phone numbers cannot be left blank!")
        .matches(/^\d{10,}$/, "must enter the number of input characters"),
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("FirstName", values.FirstName);
        formData.append("LastName", values.LastName);
        formData.append("Email", values.Email);
        formData.append("PhoneNumber", values.PhoneNumber);
        formData.append("UserName", values.UserName);
        formData.append("Password", values.Password);
        formData.append("ConfirmPassword", values.ConfirmPassword);
        const resRegisterAdmin = await AdminRegister(formData);
        if (resRegisterAdmin) {
          alert("Register successfully please authe otp to complete this!");
          navigator("/authenRegisterAdmin");
        } else {
          toast.error("Email was used or username was used", {
            autoClose: 1500,
          });
        }
      } catch (error) {
        toast.error("register not success!", {
          autoClose: 1500,
        });
      }
    },
  });

  const formikLogin = useFormik({
    initialValues: {
      userName: "",
      password: "",
      rememberMe: false,
    },

    validationSchema: Yup.object({
      userName: Yup.string().required("UserName is required!"),
      password: Yup.string().required("password is required!"),
    }),

    onSubmit: async (values) => {
      try {
        const resLogin = await AdminLogin(values);
        if (resLogin) {
          //getAdminProfile,updateAdminToken
          updateAdminToken(resLogin.data);
          const res = await GetAdminInforMation(resLogin.data);
          if (res) {
            getAdminProfile(res.data);
            res.data.role ==='staffadmin' ? navigator("/admin") : navigator("/admin/product")
          }
          toast.success("dang nhap thanh cong", {
            autoClose: 1500,
          });
          
        } else {
          toast.error("wrong username or password !!", {
            autoClose: 1500,
          });
        }
      } catch (error) {
        console.log("error login admin");
      }
    },
  });

  return (
    <div className={`wrapper-LoginRegisteradmin`}>
      <ToastContainer />
      <div className={`wrapper-LoginRegisteradmin-sub ${action}`}>
        <div className="form-box login">
          <form action="" onSubmit={formikLogin.handleSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                name="userName"
                value={formikLogin.values.userName}
                onChange={formikLogin.handleChange}
              />
              <FaUser className="icon" />
            </div>
            {formikLogin.errors.userName && (
              <span style={{ color: "red" }}>
                {formikLogin.errors.userName}
              </span>
            )}
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={formikLogin.values.password}
                onChange={formikLogin.handleChange}
              />
              <FaLock className="icon" />
            </div>
            {formikLogin.errors.password && (
              <span style={{ color: "red" }}>
                {formikLogin.errors.password}
              </span>
            )}
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  name="userName"
                  value={formikLogin.values.rememberMe}
                  onChange={(e) => {
                    formikLogin.setFieldValue(
                      "rememberMe",
                      e.target.checked ? true : false
                    );
                  }}
                />{" "}
                Remember me
              </label>
              <Link to={"/sendEmailForgotAdmin"}>Forgot Password?</Link>
            </div>
            {formikLogin.errors.rememberMe && (
              <span color="red">{formikLogin.errors.rememberMe}</span>
            )}
            <button type="submit">Login</button>
            <div className="registerAdmin-link">
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={registerAdmin}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
        <div className="form-box registerAdmin">
          <form action="" onSubmit={formik.handleSubmit}>
            <h1>Register</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="First Name"
                required
                name="FirstName"
                value={formik.values.FirstName}
                onChange={formik.handleChange}
              />
              <FaAddressCard className="icon" />
            </div>
            {formik.errors.FirstName && (
              <p className="error-register-admin-form">
                {formik.errors.FirstName}
              </p>
            )}
            <div className="input-box">
              <input
                type="text"
                placeholder="Last Name"
                required
                name="LastName"
                value={formik.values.LastName}
                onChange={formik.handleChange}
              />
              <FaAddressCard className="icon" />
            </div>
            {formik.errors.LastName && (
              <p className="error-register-admin-form">
                {formik.errors.LastName}
              </p>
            )}
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                name="UserName"
                value={formik.values.UserName}
                onChange={formik.handleChange}
              />
              <FaUser className="icon" />
            </div>
            {formik.errors.UserName && (
              <p className="error-register-admin-form">
                {formik.errors.UserName}
              </p>
            )}
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                name="Password"
                value={formik.values.Password}
                onChange={formik.handleChange}
              />
              <FaLock className="icon" />
            </div>
            {formik.errors.Password && (
              <p className="error-register-admin-form">
                {formik.errors.Password}
              </p>
            )}
            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                name="ConfirmPassword"
                value={formik.values.ConfirmPassword}
                onChange={formik.handleChange}
              />
              <FaLock className="icon" />
            </div>
            {formik.errors.ConfirmPassword && (
              <p className="error-register-admin-form">
                {formik.errors.ConfirmPassword}
              </p>
            )}
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                name="Email"
                value={formik.values.Email}
                onChange={formik.handleChange}
              />
              <FaEnvelope className="icon" />
            </div>
            {formik.errors.Email && (
              <p style={{ color: "red", margin: "0" }}>{formik.errors.Email}</p>
            )}
            <div className="input-box">
              <input
                type="text"
                placeholder="Phone Number"
                required
                name="PhoneNumber"
                value={formik.values.PhoneNumber}
                onChange={formik.handleChange}
              />
              <FaPhone className="icon" />
            </div>
            {formik.errors.PhoneNumber && (
              <p className="error-register-admin-form">
                {formik.errors.PhoneNumber}
              </p>
            )}
            <div className="remember-forgot">
              {/* <label>
                <input type="checkbox" /> I agree to the terms & conditions
              </label> */}
            </div>
            <button type="submit">Register</button>
            <div className="registerAdmin-link">
              <p>
                Already have an account?{" "}
                <a href="#" onClick={loginLink}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterAdmin;
