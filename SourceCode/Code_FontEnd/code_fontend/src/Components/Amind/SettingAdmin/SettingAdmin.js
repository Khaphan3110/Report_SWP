import React, { useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./SettingAdmin.css";
import { useAdminProfile } from "../../../Store/Hooks/Hooks";

// const Setting = () => {
//   return (
//     <Container fluid className="settings">
//       <Row>
//         <Col md={2} className="sidebar-settings">
//           <h2 className="text-center mt-3">MilkStore</h2>
//           <ListGroup variant="flush">
//             <ListGroup.Item as={Link} to="/dashboardadmin" className="text-white bg-dark">Dashboard</ListGroup.Item>
//             <ListGroup.Item as={Link} to="/preorderadmin" className="text-white bg-dark">Preorder</ListGroup.Item>
//             <ListGroup.Item as={Link} to="/settingadmin" className="text-white bg-dark">Settings</ListGroup.Item>
//           </ListGroup>
//         </Col>
//         <Col md={10} className="dashboard-content-settings">
//           <SettingAdmin />
//         </Col>
//       </Row>
//     </Container>
//   );
// };
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  AdminLogin,
  adminUpdate,
  GetAdminInforMation,
} from "../../../Service/AdminService/AdminService";
import { toast, ToastContainer } from "react-toastify";
const SettingAdmin = () => {
  const { getAdminProfile, StaffProfile, updateAdminToken } = useAdminProfile();
  const handleUpdate = (event) => {
    event.preventDefault();
    // Logic to handle update here
    console.log("Update button clicked");
  };

  useEffect(() => {
    if (StaffProfile) {
      formikupdate.setValues({
        fullname: StaffProfile.profileAdmin.fullName,
        email: StaffProfile.profileAdmin.email,
        phone: StaffProfile.profileAdmin.phoneNumber,
        password: StaffProfile.profileAdmin.password,
      });
    }
  }, [StaffProfile]);
  const formikupdate = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      phone: "",
      password: StaffProfile.profileAdmin.password || "",
    },

    validationSchema: Yup.object({
      fullname: Yup.string()
        .matches(
          /^[\p{L}\s]+$/u,
          "fullname cannot contain numbers and must only contain letters"
        )
        .required("fullname is required!"),
      email: Yup.string()
        .email("email must be a valid email address")
        .required("email is required!"),
      phone: Yup.string()
        .matches(
          /^\d{10}$/,
          "phone must be exactly 10 digits and contain only numbers"
        )
        .required("phone is required!"),
    }),

    onSubmit: async (values) => {
      try {
        console.log("password", values.password);
        const res = await adminUpdate(StaffProfile.adminToken, values);
        if (res.data.message === "Admin updated successfully") {
          await GetAdminInforMation(StaffProfile.adminToken);
          toast.success("update infor success", {
            autoClose: 1000,
          });
        } else {
          toast.error("update infor failed", {
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.log("error update admin");
      }
    },
  });

  return (
    <div className="settings__wrapper">
      <h2 className="settings__title">Settings</h2>
    <ToastContainer/>
      <div className="settings__top">
        <button className="setting__btn active__btn">Profile</button>
        <button className="setting__btn">Notification</button>
      </div>

      <div className="details__form">
        <h2 className="profile__title">Profile</h2>
        <p className="profile__desc">
          Update your photo and personal details here
        </p>
        <form onSubmit={formikupdate.handleSubmit}>
          <div className="form__group">
            <div>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                name="fullname"
                value={formikupdate.values.fullname}
                onChange={formikupdate.handleChange}
              />
              {formikupdate.errors.fullname && (
                <p style={{ color: "red", margin: "0" }}>
                  {formikupdate.errors.fullname}
                </p>
              )}
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="email"
                name="email"
                value={formikupdate.values.email}
                onChange={formikupdate.handleChange}
              />
              {formikupdate.errors.email && (
                <p style={{ color: "red", margin: "0" }}>
                  {formikupdate.errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="form__group">
            <div>
              <label>Phone number</label>
              <input
                type="text"
                placeholder="your phone"
                name="phone"
                value={formikupdate.values.phone}
                onChange={formikupdate.handleChange}
              />
              {formikupdate.errors.phone && (
                <p style={{ color: "red", margin: "0" }}>
                  {formikupdate.errors.phone}
                </p>
              )}
            </div>

            {/* <div>
              <label>Password</label>
              <input type="password" placeholder="Password" />
            </div> */}
          </div>

          {/* Add single Update button at the end of form */}
          <button className="update__btn" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingAdmin;
