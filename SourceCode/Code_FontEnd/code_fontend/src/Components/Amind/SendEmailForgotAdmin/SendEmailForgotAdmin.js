import React from "react";
import "./SendEmailForgotAdmin.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup"
import { Formik, useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
export default function SendEmailForgotAdmin() {
    const navigator = useNavigate()
    const formik = useFormik({
        initialValues : {
            EmailForgotAdmin:"",
        },
        validationSchema: Yup.object({
            EmailForgotAdmin: Yup.string()
              .required("Email is required")
          }),

        onSubmit: () => {
            navigator("/resetpasswordAdmin")
        }
    }
    )
  return (
    <div className="send-email-forgot-admin container">
      <Row>
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
                  name="EmailForgotAdmin"
                  placeholder="input email"
                  onChange={formik.handleChange}
                  value={formik.values.EmailForgotAdmin}
                ></input>
              </div>
              {formik.errors.EmailForgotAdmin && (<p style={{color:"red"}}>{formik.errors.EmailForgotAdmin}</p>)}
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
