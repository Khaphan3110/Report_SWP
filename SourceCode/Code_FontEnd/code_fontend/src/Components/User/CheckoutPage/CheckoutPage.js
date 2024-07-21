import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  Actions,
  usePreorder,
  usePromotionManger,
  useStore,
  useUserProfile,
} from "../../../Store";
import "./CheckoutPage.css";
import { GetAllPromotion } from "../../../Service/PromotionService/PromotionService";
import { urlImage } from "../../../utility/CustomAxios";

const CheckoutPage = () => {
  const [state, dispatch] = useStore();
  const navigate = useNavigate();
  const { Preorder, addPromotion } = usePreorder();
  const {
    userProfile,
    addCurrentAddress,
    getAllAdressByToken,
    updateUserToken,
    getUserProfileByToken,
  } = useUserProfile();
  const { listPromotion, getAllPromotion } = usePromotionManger();
  const [promotion, setPromotion] = useState([]);
  const param = useParams();
  const actionPram = param.action;

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
        ? userProfile.profile.member.lastName +
          " " +
          userProfile.profile.member.firstName
        : "",
      // newSelectDate: selectDate,
    },
    validationSchema: Yup.object({
      house_Numbers: Yup.string().required("không được bỏ trống số nhà!"),
      street_Name: Yup.string().required("không được bỏ trống tên đường!"),
      district_Name: Yup.string().required("không được bỏ trống quận!"),
      city: Yup.string().required("không được bỏ trống thành phố!"),
      region: Yup.string().required("không được bỏ trống đất nước!"),
      phoneNumber: Yup.string().required("không được bỏ trống só điện thoại"),
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
      if (actionPram === "order") {
        navigate("/payment/order");
      } else {
        navigate("/payment/preorder");
      }
    },
  });

  // const handleSubmit = (event) => {
  //   console.log("action param", event.target.value)
  //   event.target.value === "order" ?  navigate("/payment/order") :  navigate("/payment/preorder")
  // };

  const isEmpty = (obj) => {
    return Object.keys(obj).length !== 0;
  };

  const formikSelectPromotion = useFormik({
    initialValues: {
      selectedPromotion: "",
    },

    validationSchema: Yup.object({
      selectedPromotion: Yup.string().required(
        "promotion can not null if you want to choose some"
      ),
    }),

    onSubmit: (values) => {
      console.log("promoition", values.selectedPromotion);

      const promotionCurrent = listPromotion.find(
        (promotion) => promotion.promotionId === values.selectedPromotion
      );
      if (actionPram === "order") {
        dispatch(
          Actions.addPromotion(
            promotionCurrent.promotionId,
            promotionCurrent.discountValue
          )
        );
      } else {
        addPromotion(
          promotionCurrent.promotionId,
          promotionCurrent.discountValue,
          Preorder.totalPreOrder
        );
      }
    },
  });

  const calculateTotalWithPromotin = (promotion) => {
    return state.total - state.total * (1 - promotion / 100);
  };

  const calculateTotalPreOrderWithPromotin = (promotion) => {
    return (
      Preorder.totalPreOrder - Preorder.totalPreOrder * (1 - promotion / 100)
    );
  };

  console.log("preorder", Preorder);
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="shipping-info">
          <h2>Thông tin giao hàng</h2>
          {isEmpty(userProfile.CurrentAdress) ? (
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
              {formik.errors.fullName && (
                <p style={{ color: "red", margin: "0" }}>
                  {formik.errors.fullName}
                </p>
              )}
              <div>
                <label>Số điện thoại</label>
                {formik.values.phoneNumber ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    readOnly
                  />
                ) : (
                  <>
                  Bạn chưa có số điện thoại vui lòng đăng ký 
                  <Link to={"/addresses"}> Đăng ký số điện thoại</Link>
                  </>
                )}
              </div>
              {formik.errors.phoneNumber && (
                <p style={{ color: "red", margin: "0" }}>
                  {formik.errors.phoneNumber}
                </p>
              )}
              <div>
                <label>Địa chỉ</label>

                <input
                  type="text"
                  name="house_Numbers"
                  value={formik.values.house_Numbers}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.house_Numbers && (
                <p style={{ color: "red", margin: "0" }}>
                  {formik.errors.house_Numbers}
                </p>
              )}
              <div>
                <label>Phường / Xã</label>
                <input
                  type="text"
                  name="treet_Name"
                  value={formik.values.street_Name}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.street_Name && (
                <p style={{ color: "red", margin: "0" }}>
                  {formik.errors.street_Name}
                </p>
              )}
              <div>
                <label>Quận / Huyện</label>
                <input
                  type="text"
                  name="district_Name"
                  value={formik.values.district_Name}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.district_Name && (
                <p style={{ color: "red", margin: "0" }}>
                  {formik.errors.district_Name}
                </p>
              )}
              <div>
                <label>Tỉnh / Thành phố</label>
                <input
                  type="text"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.city && (
                <p style={{ color: "red", margin: "0" }}>
                  {formik.errors.city}
                </p>
              )}
              <button
                className="continue-button"
                type="submit"
                // onClick={handleSubmit}
              >
                Tiếp tục đến phương thức thanh toán
              </button>
            </form>
          ) : (
            <div style={{}}>
              <h2>
                Hiện tại chưa có địa chỉ !!! Nhập tại{" "}
                <Link to={"/addresses"}>Đây</Link>
              </h2>
            </div>
          )}
        </div>
        <div className="order-summary">
          <h2>Tóm tắt đơn hàng</h2>
          {actionPram === "order" ? (
            <>
              {state.cartItems.map((item, index) => (
                <div className="product-summary" key={index}>
                  <img
                    src={`${urlImage}/${
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
              {listPromotion && listPromotion.length > 0 ? (
                <>
                  <div className="discount-code">
                    <form onSubmit={formikSelectPromotion.handleSubmit}>
                      <label>Mã giảm giá</label>
                      <div className="wrapper-promotion-checkout-page">
                        <select
                          style={{ height: "42px", marginRight: "5px" }}
                          name="selectedPromotion"
                          value={formikSelectPromotion.values.selectedPromotion}
                          onChange={(e) => {
                            // console.log("values", e.target.value);
                            formikSelectPromotion.setFieldValue(
                              "selectedPromotion",
                              e.target.value
                            );
                          }}
                          onBlur={formikSelectPromotion.handleBlur}
                        >
                          <option value="" label="Chọn một mã khuyến mãi" />
                          {listPromotion && listPromotion.length > 0 &&
                            listPromotion.map((promote, index) => (
                              <option value={promote.promotionId} key={index}>
                                {promote.name}
                              </option>
                            ))}
                        </select>

                        <button
                          type="submit"
                          className="button-promotion-checkout-page"
                        >
                          Áp dụng
                        </button>
                      </div>
                      {formikSelectPromotion.touched.selectedPromotion &&
                      formikSelectPromotion.errors.selectedPromotion ? (
                        <div
                          className="error"
                          style={{ color: "red", margin: "0" }}
                        >
                          {formikSelectPromotion.errors.selectedPromotion}
                        </div>
                      ) : null}
                    </form>
                  </div>
                  <h4 style={{ color: "#ff6f61" }}>
                    ban đã được giảm{" "}
                    {calculateTotalWithPromotin(
                      state.promotion.promotionValues
                    ).toLocaleString()}{" "}
                    đ
                  </h4>
                </>
              ) : (
                <div>
                  <p style={{ color: "#f592a2", fontWeight: "bold" }}>
                    Hiện tại chưa có khuyến mãi nào khác
                  </p>
                </div>
              )}

              <div className="total-price">
                <span>Tổng cộng: </span>
                <span>{state.total.toLocaleString()} ₫</span>
              </div>
            </>
          ) : (
            <>
              <div className="product-summary">
                <img
                  src={`${urlImage}${
                    Preorder.preOrderProduct.images[0]
                      ? Preorder.preOrderProduct.images[0].imagePath
                      : "productImage"
                  }`}
                  alt={Preorder.preOrderProduct.productName}
                />
                <div className="product-info">
                  <p>{Preorder.preOrderProduct.productName}  </p>
                  <p> {Preorder.preOrderProduct.price.toLocaleString()}₫  x{Preorder.preOrderProduct.quantity}</p>
                </div>
              </div>
              {listPromotion && listPromotion.length > 0 ? (
                <>
                  <div className="discount-code">
                    <form onSubmit={formikSelectPromotion.handleSubmit}>
                      <label>Mã giảm giá</label>
                      <div className="wrapper-promotion-checkout-page">
                        <select
                          style={{ height: "42px", marginRight: "5px" }}
                          name="selectedPromotion"
                          value={formikSelectPromotion.values.selectedPromotion}
                          onChange={(e) => {
                            // console.log("values", e.target.value);
                            formikSelectPromotion.setFieldValue(
                              "selectedPromotion",
                              e.target.value
                            );
                          }}
                          onBlur={formikSelectPromotion.handleBlur}
                        >
                          <option value="" label="Chọn một mã khuyến mãi" />
                          {listPromotion && listPromotion.length > 0 &&
                            listPromotion.map((promote, index) => (
                              <option value={promote.promotionId} key={index}>
                                {promote.name}
                              </option>
                            ))}
                        </select>

                        <button
                          type="submit"
                          className="button-promotion-checkout-page"
                        >
                          Áp dụng
                        </button>
                      </div>
                      {formikSelectPromotion.touched.selectedPromotion &&
                      formikSelectPromotion.errors.selectedPromotion ? (
                        <div
                          className="error"
                          style={{ color: "red", margin: "0" }}
                        >
                          {formikSelectPromotion.errors.selectedPromotion}
                        </div>
                      ) : null}
                    </form>
                  </div>
                  <h4 style={{ color: "#ff6f61" }}>
                    ban đã được giảm{" "}
                    {calculateTotalPreOrderWithPromotin(
                      Preorder.promotionPreorder.promotionValues
                        ? Preorder.promotionPreorder.promotionValues
                        : 1
                    ).toLocaleString()}{" "}
                    đ
                  </h4>
                </>
              ) : (
                <div>
                  <p style={{ color: "#f592a2", fontWeight: "bold" }}>
                    Hiện tại chưa có khuyến mãi nào khác
                    {calculateTotalPreOrderWithPromotin(
                      Preorder.promotionPreorder.promotionValues
                        ? Preorder.promotionPreorder.promotionValues
                        : 1
                    ).toLocaleString()}{" "}
                    đ
                  </p>
                </div>
              )}

              <div className="total-price">
                <span>Tổng cộng: </span>
                <span>{Preorder.totalPreOrder.toLocaleString()} ₫</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
