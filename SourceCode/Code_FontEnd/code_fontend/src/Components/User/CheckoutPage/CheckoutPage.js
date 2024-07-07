import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useStore, useUserProfile } from "../../../Store";
import "./CheckoutPage.css";
const CheckoutPage = () => {
  const [state, dispatch] = useStore();
  const navigate = useNavigate();

  const {
    userProfile,
    addCurrentAddress,
    getAllAdressByToken,
    updateUserToken,
    getUserProfileByToken,
  } = useUserProfile();
  console.log("dai chi hien tai", userProfile.CurrentAdress);
  const formik = useFormik({
    initialValues: {
      //thư viện dùng để chứa dữ liệu từ formik
      house_Numbers: userProfile ? userProfile.CurrentAdress.house_Number : "",
      street_Name: userProfile ? userProfile.CurrentAdress.street_Name : "",
      district_Name: userProfile ? userProfile.CurrentAdress.district_Name : "",
      city: userProfile ? userProfile.CurrentAdress.city : "",
      region: "Việt Nam",
      phoneNumber: userProfile ? userProfile.profile.member.phoneNumber : "",
      fullName: userProfile
        ? userProfile.profile.member.lastName + " " + userProfile.profile.member.firstName
        : "",
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
      const addressCurrent = {
        house_Number: values.house_Numbers,
        street_Name: values.street_Name,
        district_Name: values.district_Name,
        city: values.city,
        region: values.region,
      };
      addCurrentAddress(addressCurrent);
      navigate("/payment");
    },
  });

  const handleSubmit = (event) => {
    navigate("/payment");
  };

  const isEmpty = (obj) =>{
    return Object.keys(obj).length !== 0
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="shipping-info">
          
          <h2>Thông tin giao hàng</h2>
          {isEmpty(userProfile.CurrentAdress) ? 
          (
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                readOnly
              />
            </div>
            <div>
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                readOnly
              />
            </div>
            <div>
              <label>Địa chỉ</label>
              <input
                type="text"
                name="house_Numbers"
                value={formik.values.house_Numbers}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <label>Phường / Xã</label>
              <input
                type="text"
                name="treet_Name"
                value={formik.values.street_Name}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <label>Quận / Huyện</label>
              <input
                type="text"
                name="district_Name"
                value={formik.values.district_Name}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <label>Tỉnh / Thành phố</label>
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
            </div>
            <button
              className="continue-button"
              type="submit"
              onClick={handleSubmit}
            >
              Tiếp tục đến phương thức thanh toán
            </button>
          </form>
          ) 
          : 
          (<div style={{}}><h2>Hiện tại chưa có địa chỉ !!! Nhập tại <Link to={"/addresses"}>Đây</Link></h2></div>)}
          
        </div>
        <div className="order-summary">
          <h2>Tóm tắt đơn hàng</h2>
          {state.cartItems.map((item, index) => (
            <div className="product-summary" key={index}>
              <img
                src={`https://localhost:44358/user-content/${
                  item.images[0] ? item.images[0].imagePath : "productImage"
                }`}
                alt={item.productName}
              />
              <div className="product-info">
                <p>{item.productName}</p>
                <p>
                  {" "}
                  {item.price.toLocaleString()}₫ x {item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="discount-code">
            <label>Mã giảm giá</label>
            <input type="text" />
            <button>Áp dụng</button>
          </div>
          <div className="total-price">
            <span>Tổng cộng: </span>
            <span>{state.total.toLocaleString()} ₫</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
