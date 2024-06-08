import React from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ResetPasswordPage = () => {
  const { token, email } = useParams(); // Extract token and email from URL parameters

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      email: email,
      token: token,
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Please enter a new password")
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:,<.>]).{8,}$/,
          "Password must contain at least 8 characters, one uppercase letter, and one special character"
        ),
      confirmPassword: Yup.string()
        .required("Please confirm your new password")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(`/api/Users/ResetPassword`, {
          token: values.token,
          email: values.email,
          newPassword: values.newPassword,
        });
        // Handle successful password reset
      } catch (error) {
        // Handle password reset failure
      }
    },
  });

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <div>{formik.errors.newPassword}</div>
          )}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />
          {formik.touched.confirmPassword &&
            formik.errors.confirmPassword && (
              <div>{formik.errors.confirmPassword}</div>
            )}
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
