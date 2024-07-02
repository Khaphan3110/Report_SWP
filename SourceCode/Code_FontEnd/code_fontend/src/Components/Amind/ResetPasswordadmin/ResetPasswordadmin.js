import { useFormik } from 'formik'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import * as Yup from "yup"
import "./ResetPasswordadmin.css"
export default function ResetPasswordadmin() {
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
        initialValues : {
            NewPassword:"",
            NewerPassword:"",
        },
        validationSchema: Yup.object({
            NewPassword: Yup.string()
              .required("please enter new password").matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
                "Password must have at least 7 characters, including 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
              ),
            NewerPassword: Yup.string()
            .required("please confirm new password").oneOf([Yup.ref('NewPassword'), null], 'Password must match new password')
          }),

        onSubmit: () => {
            navigator("/resetpasswordAdmin")
        }
    }
    )
  return (
    <div className="reset-password-forgot-admin container">
    <Row>
      <Col className="reset-password-forgot-admin-wrapper-form">
        <form onSubmit={formik.handleSubmit}>
          <div className="header-reset-password-forgot-admin">
            <h4>Reset Password</h4>
          </div>
          <div className="input-reset-password-admin-wrapper">
            <p>New Password: </p>
            <div  className="input-reset-password-admin">
              <input
                type={typeInputForm}
                name="NewPassword"
                placeholder="input email"
                onChange={formik.handleChange}
                value={formik.values.NewPassword}
              ></input>
               <i className={iconShow} onClick={handlerOnclickIcon}></i>
            </div>
            {formik.errors.NewPassword && (<p style={{color:"red"}}>{formik.errors.NewPassword}</p>)}
            <p>Confirm Password: </p>
            <div  className="input-reset-password-admin">
              <input
                type={typeInputForm}
                name="NewerPassword"
                placeholder="input email"
                onChange={formik.handleChange}
                value={formik.values.NewerPassword}
              ></input>
               <i className={iconShow} onClick={handlerOnclickIcon}></i>
            </div>
            {formik.errors.NewerPassword && (<p style={{color:"red"}}>{formik.errors.NewerPassword}</p>)}
            
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
  )
}
