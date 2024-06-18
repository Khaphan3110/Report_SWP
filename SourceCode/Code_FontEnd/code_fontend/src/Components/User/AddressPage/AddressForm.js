import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { userAddAdress } from "../../../Service/UserService/UserService";
import { toast } from "react-toastify";
const AddressForm = ({ show, handleClose, initialData, onSave }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const formik = useFormik({
    initialValues: {
      //thư viện dùng để chứa dữ liệu từ formik
      house_Numbers: "",
      street_Name: "",
      district_Name: "",
      city: "",
      region: "",
      // newSelectDate: selectDate,
    },
    validationSchema: Yup.object({
      house_Numbers: Yup.string().required("không được bỏ trống số nhà!"),
      street_Name: Yup.string().required("không được bỏ trống tên đường!"),
      district_Name: Yup.string().required("không được bỏ trống quận!"),
      city: Yup.string().required("không được bỏ trống thành phố!"),
      region: Yup.string().required("không được bỏ trống đất nước!"),
    }),

    onSubmit: async (values) => {
      const resAddadres = await userAddAdress(userToken, values);
      if (resAddadres.data.message === "Address added successfully") {
        toast.success("thêm địa chỉ thành công", {
          autoClose: 1000,
        });
      } else {
        toast.error("thêm địa chỉ không thành công", {
          autoClose: 1000,
        });
      }
    },
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="house_Numbers">
            <Form.Label>số nhà</Form.Label>
            <Form.Control
              type="text"
              name="house_Numbers"
              value={formik.house_Numbers}
              onChange={formik.handleChange}
            />
            {formik.errors.house_Numbers && (
              <p style={{ color: "red" }}>{formik.errors.house_Numbers}</p>
            )}
          </Form.Group>
          <Form.Group controlId="street_Name">
            <Form.Label>Tên đường</Form.Label>
            <Form.Control
              type="text"
              name="street_Name"
              value={formik.street_Name}
              onChange={formik.handleChange}
            />
            {formik.errors.street_Name && (
              <p style={{ color: "red" }}>{formik.errors.street_Name}</p>
            )}
          </Form.Group>
          <Form.Group controlId="district_Name">
            <Form.Label>tên quận</Form.Label>
            <Form.Control
              type="text"
              name="district_Name"
              value={formik.district_Name}
              onChange={formik.handleChange}
            />
            {formik.errors.district_Name && (
              <p style={{ color: "red" }}>{formik.errors.district_Name}</p>
            )}
          </Form.Group>
          <Form.Group controlId="city">
            <Form.Label>Tên Thành phố</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formik.city}
              onChange={formik.handleChange}
            />
            {formik.errors.city && (
              <p style={{ color: "red" }}>{formik.errors.city}</p>
            )}
          </Form.Group>
          <Form.Group controlId="region">
            <Form.Label>Quốc gia</Form.Label>
            <Form.Control
              as="select"
              name="region"
              value={formik.region}
              onChange={formik.handleChange}
            >
              <option value="">- Please Select -</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Hoa Kỳ">Hoa Kỳ</option>
              <option value="Vương quốc Anh">Vương Quốc Anh</option>
            </Form.Control>
            {formik.errors.region && (
              <p style={{ color: "red" }}>{formik.errors.region}</p>
            )}
          </Form.Group>
          <Form.Group controlId="formDefaultAddress">
            <Form.Check
              type="checkbox"
              name="defaultAddress"
              label="Đặt là địa chỉ mặc định?"
              // checked={formData.defaultAddress}
              // onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddressForm;
