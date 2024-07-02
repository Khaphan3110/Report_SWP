import React from 'react'
import "./AuthenRegister.css"
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Col, Row } from 'react-bootstrap'
export default function AuthenRegister() {
    const navigator = useNavigate()
    const formik = useFormik({
        initialValues : {
            OTP:"",
        },
        validationSchema: Yup.object({
            OTP: Yup.string()
              .required("otp is required").matches(/^\d{6}$/,"only enter number and enought 6 numbers")
          }),

        onSubmit: async () => {
            navigator("/login")
        }
    }
    )
  return (
    <div className="authen-register-admin container">
    <Row>
      <Col className="authen-register-admin-wrapper-form">
        <form onSubmit={formik.handleSubmit}>
          <div className="header-authen-register-forgot-admin">
            <h4>Enter OTP to complete register!</h4>
            <p>We sent otp, please check your email</p>
          </div>
          <div className="input-authen-register-admin-wrapper">
            <p>OTP: </p>
            <div  className="input-authen-register-admin">
              <input
                type="email"
                name="OTP"
                placeholder="input otp"
                onChange={formik.handleChange}
                value={formik.values.OTP}
              ></input>
            </div>
            {formik.errors.OTP && (<p style={{color:"red"}}>{formik.errors.OTP}</p>)}

            <button type="submit" className="button-authen-register-admin">
              <p>Send</p>
            </button>
          </div>
        </form>
      </Col>
    </Row>
  </div>
  )
}
