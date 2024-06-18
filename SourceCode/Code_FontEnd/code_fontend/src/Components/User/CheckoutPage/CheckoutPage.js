import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import { useStore } from "../../../Store";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  getUserAddAdress,
  getUserInfor,
} from "../../../Service/UserService/UserService";
const CheckoutPage = () => {
  const [state, dispatch] = useStore();
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userInfor, setUserInfor] = useState();
  const [addressCheckoutPay, setaddressCheckoutPay] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInforToCheckoutPay = async () => {
      const resUserInfor = await getUserInfor(userToken);
      if (resUserInfor) {
        setUserInfor(resUserInfor.data);
      }
    };
    getUserInforToCheckoutPay();
  }, []);

  useEffect(() => {
    const resUserAdress = async () => {
      const resAddress = await getUserAddAdress(userToken);
      if (resAddress) {
        setaddressCheckoutPay(resAddress.data);
      }
    };
    resUserAdress();
  }, []);



  const formik = useFormik({
    initialValues: {
      //thư viện dùng để chứa dữ liệu từ formik
      house_Numbers: "",
      street_Name: "",
      district_Name:"",
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
      navigate("/payment")
    },
  });

  const handleSubmit = (event) =>{
    navigate("/payment")
  }

  return (
    <div className="checkout-page">
      <div className="breadcrumb">
        <a href="/">Trang chủ</a> / <a href="/cart">Giỏ hàng</a> / Thông tin
        giao hàng
      </div>
      <div className="checkout-container">
        <div className="shipping-info">
          <h2>Thông tin giao hàng</h2>
          <form onSubmit={formik.handleSubmit}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              readOnly
              value={
                userInfor &&
                userInfor.member.lastName + " " + userInfor.member.firstName
              }
            />
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              readOnly
              value={userInfor && userInfor.member.phoneNumber}
            />
            <label>Địa chỉ</label>
            <input
              type="text"
              name="house_Numbers"
              readOnly
              value={addressCheckoutPay && addressCheckoutPay.house_Number}
            />
            <label>Phường / Xã</label>
            <input
              type="text"
              name="treet_Name"
              readOnly
              value={addressCheckoutPay && addressCheckoutPay.street_Name }
            />
            <label>Quận / Huyện</label>
            <input
              type="text"
              name="district_Name"
              readOnly
              value={addressCheckoutPay && addressCheckoutPay.district_Name }
            />
            <label>Tỉnh / Thành phố</label>
            <input
              type="text"
              name="city"
              readOnly
              value={addressCheckoutPay && addressCheckoutPay.city }
            />
            <button className="continue-button" type="submit" onClick={handleSubmit} >
              Tiếp tục đến phương thức thanh toán
            </button>
          </form>
        </div>
        <div className="order-summary">
          <h2>Tóm tắt đơn hàng</h2>
          {state.cartItems.map((item, index) => (
            <div className="product-summary" key={index}>
              <img src={item.image} alt={item.productName} />
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
