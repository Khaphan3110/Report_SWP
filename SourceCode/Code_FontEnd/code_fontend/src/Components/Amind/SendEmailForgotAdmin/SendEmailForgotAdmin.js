import React from "react";
import "./SendEmailForgotAdmin.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup"
import { Formik, useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { SendEmailResetPasswordAdmin } from "../../../Service/AdminService/AdminService";
import { ToastContainer, toast } from "react-toastify";
export default function SendEmailForgotAdmin() {
    const navigator = useNavigate()
    const formik = useFormik({
        initialValues : {
            email:"",
        },
        validationSchema: Yup.object({
            email: Yup.string()
              .required("Email is required")
          }),

        onSubmit: async (values) => {
          try {
            const res = await SendEmailResetPasswordAdmin(values.email)
            if(res){
              navigator("/resetpasswordAdmin")
            } else {
              toast.error("Email wrong or not exit!!",{
                autoClose:1500,
              })
            } 
            
          } catch (error) {
            console.log("lỗi ở send email reset password",error)
          }
           
        }
    }
    )
  return (
    <div className="send-email-forgot-admin">
      <Row>
      <ToastContainer/>
        <Col className="send-email-forgot-admin-wrapper-form">
          <form onSubmit={formik.handleSubmit}>
            <div className="header-send-email-forgot-admin">
              <h4>Enter EMAIL to get password</h4>
            </div>
            <div className="input-forgot-admin-wrapper">
              <p>Email: </p>
              <div  className="input-forgot-admin">
                <input
                  type="email"
                  name="email"
                  placeholder="input email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                ></input>
              </div>
              {formik.errors.email && (<p style={{color:"red"}}>{formik.errors.email}</p>)}
              <div className="link-return-loginadmin">
                <span>Return </span>
                <Link to={"/loginadmin"}>login Page</Link>
              </div>
              <button type="submit" className="button-send-email-admin">
                <p>Send</p>
              </button>
            </div>
          </form>
        </Col>
      </Row>
    </div>
  );
}
