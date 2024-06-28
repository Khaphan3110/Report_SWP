import "bootstrap/dist/css/bootstrap.min.css";
import { signInWithPopup } from "firebase/auth";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { auth, provider } from "../Config/configAuthenFirebase";
import "./LoginForm.css";
import {
  userLoginGoogle,
  userLogin,
} from "../../../Service/UserService/UserService";
import { ToastContainer, toast } from "react-toastify";
import { useUserProfile } from "../../../Store";

export default function LoginForm() {
  const [typeInputForm, setTypeInputForm] = useState("password");
  const listIcon = ["fa-solid fa-eye-slash", "fa-solid fa-eye"];
  const [iconShow, setIconShow] = useState(["fa-solid fa-eye-slash"]);
  const navigator = useNavigate();
  const { userProfile,setUserProfile,updateUserToken } = useUserProfile()
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
      userName: "",
      password: "",
      rememberMe: false,
    },

    validationSchema: Yup.object({
      userName: Yup.string()
        .required("nhập tên đăng nhập!")
        .matches(/^\S+$/, "Không có khoảng trắng"),
    }),

    onSubmit: async (values) => {
      const formData = new FormData();
      // "userName": "haphong",
      // "password": "Ss@12345",
      // "rememberMe": true
      formData.append("userName", values.userName);
      formData.append("password", values.password);
      formData.append("rememberMe", values.rememberMe);
      const res = await userLogin(values);

      if (res.data) {
        updateUserToken(res.data);
        // console.log("đây là login",res.data)
        navigator("/");
      } else {
        toast.error("tên nhập sai hoặc sai mật khẩu");
      }
    },
  });

  const [userValueGoogle, setuserValueGoogle] = useState({});
  const navigate = useNavigate(); //sử dựng để điều hướng trang
  const handleLoginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userValue = {
        email: result.user.email,
        firstName: result._tokenResponse.firstName,
        lastName: result._tokenResponse.lastName,
      };
     
      const res = await userLoginGoogle(userValue);
      if (res) {
        updateUserToken(res.data.token)
        toast.success("đăng nhập  thành công");
        navigate("/");
      } else {
        toast.error("đăng nhập google thất bại")
      }
      
    } catch (error) {
      console.log(error);
    }
  };

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
              <div className="L-form">
                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <p>
                      Tên đăng nhập <span>*</span>
                    </p>
                    <div className="L-input-place">
                      <input
                        type="text"
                        name="userName"
                        placeholder="Input your email"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                      ></input>
                    </div>
                    {formik.errors.userName && (
                      <p className="errorMsg">{formik.errors.userName}</p>
                    )}
                  </div>
                  <p>
                    Mật Khẩu <span>*</span>
                  </p>
                  <div className="L-input-place">
                    <input
                      type={typeInputForm}
                      name="password"
                      placeholder="nhập mật khẩu của bạn"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    ></input>
                    <i className={iconShow} onClick={handlerOnclickIcon}></i>
                  </div>
                  <div className="button-rememberMe">
                    <label htmlFor="rememberMe">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        value={formik.values.rememberMe}
                        onChange={formik.handleChange}
                      />{" "}
                      Remember me
                    </label>
                  </div>
                  <div className="link-Fogot-password">
                    <p>
                      quên mật khẩu ?
                      <Link to={"/sendEmailForgot"}> Nhấn Vào Đây</Link>
                    </p>
                  </div>
                  <div className="b-form-login">
                    <button type="submit">
                      <p>Đăng Nhập</p>
                    </button>
                  </div>
                </form>
                <hr className="hr"></hr>
                <div className="b-form-login-google">
                  <button onClick={handleLoginGoogle}>
                    <p>Đăng nhập Google</p>
                  </button>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
                    alt="Google image"
                    width={"30px"}
                  ></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
