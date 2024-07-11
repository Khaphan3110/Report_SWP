import { useFormik } from "formik";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "./ResetPasswordadmin.css";
import { ResetPasswordAdmin } from "../../../Service/AdminService/AdminService";
import { ToastContainer, toast } from "react-toastify";
export default function ResetPasswordadmin() {
  const [typeInputForm, setTypeInputForm] = useState("password");
  const listIcon = ["fa-solid fa-eye-slash", "fa-solid fa-eye"];
  const [iconShow, setIconShow] = useState(["fa-solid fa-eye-slash"]);
  const navigator = useNavigate();
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
      NewPassword: "",
      password: "",
      OTP: "",
    },
    validationSchema: Yup.object({
      OTP: Yup.string().required("OTP is required"),
      NewPassword: Yup.string()
        .required("please enter new password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
          "Password must have at least 7 characters, including 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
        ),
      password: Yup.string()
        .required("please confirm new password")
        .oneOf([Yup.ref("password"), null], "Password must match new password"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await ResetPasswordAdmin(values.OTP, values);
        if (res) {
          navigator("/loginadmin");
        } else {
          toast.error("OTP is not right!", {
            autoClose: 1500,
          });
        }
      } catch (error) {
        console.log("lỗi reset password", error);
      }
    },
  });
  return (
    <div className="reset-password-forgot-admin">
      <Row>
        <ToastContainer />
        <Col className="reset-password-forgot-admin-wrapper-form">
          <form onSubmit={formik.handleSubmit}>
            <div className="header-reset-password-forgot-admin">
              <h4>Reset Password</h4>
            </div>
            <div className="input-reset-password-admin-wrapper">
              <p>OTP: </p>
              <div className="input-reset-password-admin">
                <input
                  type="text"
                  name="OTP"
                  placeholder="input OTP"
                  onChange={formik.handleChange}
                  value={formik.values.OTP}
                ></input>
              </div>
              {formik.errors.OTP && (
                <p style={{ color: "red" }}>{formik.errors.OTP}</p>
              )}
              <p>New Password: </p>
              <div className="input-reset-password-admin">
                <input
                  type={typeInputForm}
                  name="NewPassword"
                  placeholder="input email"
                  onChange={formik.handleChange}
                  value={formik.values.NewPassword}
                ></input>
                <i className={iconShow} onClick={handlerOnclickIcon}></i>
              </div>
              {formik.errors.NewPassword && (
                <p style={{ color: "red" }}>{formik.errors.NewPassword}</p>
              )}
              <p>Confirm Password: </p>
              <div className="input-reset-password-admin">
                <input
                  type={typeInputForm}
                  name="password"
                  placeholder="input email"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                ></input>
                <i className={iconShow} onClick={handlerOnclickIcon}></i>
              </div>
              {formik.errors.password && (
                <p style={{ color: "red" }}>{formik.errors.password}</p>
              )}

              <div className="link-return-loginadmin">
                <span>Return </span>
                <Link to={"/loginadmin"}>login Page</Link>
              </div>
              <button type="submit" className="button-reset-password-admin">
                <p>Send</p>
              </button>
            </div>
          </form>
        </Col>
      </Row>
    </div>
  );
}
