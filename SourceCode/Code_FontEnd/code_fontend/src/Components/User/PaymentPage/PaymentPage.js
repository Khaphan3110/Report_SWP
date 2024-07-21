import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./PaymentPage.css";
import { Actions, useOrderManager, usePreorder, useStore, useUserProfile } from "../../../Store";
import {
  checkoutPay,
  createOrder,
  OCDPayment,
  paymentCallBack,
} from "../../../Service/OrderService/OrderService";
import { toast, ToastContainer } from "react-toastify";
import {
  createPreOrder,
  PreorderDeposit,
  VnpayCheckout,
} from "../../../Service/PreorderService/PreorderService";
import { TableCell, TableRow } from "@mui/material";
import { urlImage } from "../../../utility/CustomAxios";
const PaymentPage = () => {
  const navigator = useNavigate();
  const [state, dispatch] = useStore();
  const [statePaymentMethod, setstatePaymentMethod] = useState("");
  const [formattedArray, setFormattedArray] = useState([]);
  const [orderInfor, setOrderInfor] = useState(null);
  const { orderAgain } = useOrderManager()
  const { preOrderAgain } = usePreorder()
  const {
    userProfile,
    addCurrentAddress,
    getAllAdressByToken,
    updateUserToken,
    getUserProfileByToken,
  } = useUserProfile();
  const paramPayment = useParams();
  const actionPayment = paramPayment.actionPayment;
  const transformArray = () => {
    const transformedArray = state.cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
    setFormattedArray(transformedArray);
  };
  const { Preorder } = usePreorder();
  // Gọi hàm biến đổi khi component được render
  useEffect(() => {
    transformArray();
  }, []);

  useEffect(() => {
    if (formattedArray.length > 0) {
      setOrderInfor({
        token: userProfile.userToken,
        shippingAddress: userProfile
          ? userProfile.CurrentAdress.house_Number +
          "," +
          userProfile.CurrentAdress.street_Name +
          "," +
          userProfile.CurrentAdress.district_Name +
          "," +
          userProfile.CurrentAdress.city +
          "," +
          userProfile.CurrentAdress.region
          : "kh co địa chỉ",
        promotionId: state.promotion.promotions,
        orderDetails: formattedArray,
        totalAmount: Math.ceil(state.total),
      });
    }
  }, [formattedArray, state.total]);

  const handPaymentOCD = (event) => {
    setstatePaymentMethod(event.target.value);
  };

  const handPaymentVNP = (event) => {
    setstatePaymentMethod(event.target.value);
  };

  const handlePayment = async () => {
    // alert("vô");
    // console.log("action", actionPayment);
    try {
      if (actionPayment === "order") {
        if (statePaymentMethod === "cod") {
          // alert("chua thuc  hien xong :))))()()()");
          try {
            const resCreateOrder = await createOrder(orderInfor);
            if (resCreateOrder) {
              const orderInforPayment = {
                orderId: resCreateOrder.data.order.orderId,
                memberId: resCreateOrder.data.order.memberId,
                promotionId: resCreateOrder.data.order.promotionId,
                shippingAddress: resCreateOrder.data.order.shippingAddress,
                totalAmount: resCreateOrder.data.order.totalAmount,
                orderStatus: resCreateOrder.data.order.orderStatus,
                orderDate: resCreateOrder.data.order.orderDate,
              };
              const paymentOCD = await OCDPayment(orderInforPayment, userProfile.userToken);
              if (paymentOCD.status === 200) {
                navigator("/payment/success")
              } else {
                navigator("/payment/notsuccess")
              }
            }
          } catch (error) {
            console.log("error at COD order", error)
          }

        } else if (statePaymentMethod === "vnpay") {
          const payMentOCD = await createOrder(orderInfor);
          console.log("orderinfor before", payMentOCD)
          if (payMentOCD) {
            console.log("order", payMentOCD.data);
            const orderInforPayment = {
              orderId: payMentOCD.data.order.orderId,
              memberId: payMentOCD.data.order.memberId,
              promotionId: payMentOCD.data.order.promotionId,
              shippingAddress: payMentOCD.data.order.shippingAddress,
              totalAmount: Math.ceil(payMentOCD.data.order.totalAmount),
              orderStatus: payMentOCD.data.order.orderStatus,
              orderDate: payMentOCD.data.order.orderDate,
            };
            const payMentVNPAY = await checkoutPay(
              userProfile.userToken,
              orderInforPayment
            );
            if (payMentVNPAY) {
              window.open(payMentVNPAY.data.paymentUrl, "_blank");
              // dispatch(() => Actions.clearListToCart());
            }
            // alert("thanh toan thanh cong mua  hang tiep  nao");
            // navigator("/");
          } else {
            toast.error("tạo đơn hàng không thành công", {
              autoClose: 500,
            });
          }
        } else if (!statePaymentMethod) {
          toast.error("Vui lòng chọn phương thức thanh toán ", {
            autoClose: 1000,
          });
        }
      } else if (actionPayment === 'PreorderAgain') {
        if (statePaymentMethod === "cod") {
          toast.error("chỉ được chọn Vn pay với đơn đặt trước", {
            autoClose: 1000,
          })
        } else if (statePaymentMethod === "vnpay") {
          try {
            const PreorderAgainDepoti = {
              preorderId: preOrderAgain.preorderId,
              productId: preOrderAgain.productId,
              memberId:preOrderAgain.memberId,
              shippingAddress: preOrderAgain.shippingAddress,
              quantity: preOrderAgain.quantity,
              preorderDate: new Date().toISOString,
              total: Math.ceil(preOrderAgain.total),
              status: preOrderAgain.status
            }
            console.log("data preorderbefore deposit", PreorderAgainDepoti)
            const resDeposit = await PreorderDeposit(PreorderAgainDepoti);
            const memberID = userProfile.profile.member.memberId
            console.log("data preorder", resDeposit)
            if (resDeposit) {
              const DepoDate = new Date()
              const dataCheckout = {
                preorderId: preOrderAgain.preorderId,
                productId: preOrderAgain.productId,
                shippingAddress: preOrderAgain.shippingAddress,
                memberId: preOrderAgain.memberId,
                quantity: preOrderAgain.quantity,
                preorderDate: DepoDate.toISOString(),
                total: Math.ceil(resDeposit.data.amount) < 20000 ? Math.ceil(resDeposit.data.amount) * 100 : Math.ceil(resDeposit.data.amount),
                status: preOrderAgain.status,
              };
              const VNpaycheckout = await VnpayCheckout(dataCheckout);
              if (VNpaycheckout) {
                const url = VNpaycheckout.data.paymentUrl
                window.open(url, "_blank");
              }
            }
          } catch (error) {
            console.log("error at payment preorder again", error)
          }
        } else if (!statePaymentMethod) {
          toast.error("Vui lòng chọn phương thức thanh toán VNpay", {
            autoClose: 1000,
          });
        }

      } else if (actionPayment === 'orderAgain') {
        if (statePaymentMethod === "cod") {
          const paymentOCD = await OCDPayment(orderAgain, userProfile.userToken);
          if (paymentOCD.status === 200) {
            navigator("/payment/success")
          } else {
            navigator("/payment/notsuccess")
          }
        } else if (statePaymentMethod === "vnpay") {
          try {
            const Order = {
              ...orderAgain,
              orderDate: new Date().toISOString()
            }
            const payMentVNPAYOrderAgain = await checkoutPay(
              userProfile.userToken,
              Order
            );
            if (payMentVNPAYOrderAgain) {
              window.open(payMentVNPAYOrderAgain.data.paymentUrl, "_blank");
            }
          } catch (error) {
            console.log("error at payment order again", error)
          }
        } else if (!statePaymentMethod) {
          toast.error("Vui lòng chọn phương thức thanh toán", {
            autoClose: 1000,
          });
        }
      } else {
        if (statePaymentMethod === "cod") {
          toast.error("với đơn đặt trước chọn vnpay nhen", {
            autoClose: 1000,
          })
        } else if (statePaymentMethod === "vnpay") {
          const PreOrderInfor = {
            productId: Preorder.preOrderProduct.productId,
            token: userProfile.userToken, //Preorder.preOrderProduct.productId
            shippingAddress: userProfile
              ? userProfile.CurrentAdress.house_Number +
              "," +
              userProfile.CurrentAdress.street_Name +
              "," +
              userProfile.CurrentAdress.district_Name +
              "," +
              userProfile.CurrentAdress.city +
              "," +
              userProfile.CurrentAdress.region
              : "kh co địa chỉ",
            quantity: Preorder.preOrderProduct.quantity,
            total: Math.ceil(Preorder.totalPreOrder),
            status: 0,
          };
          console.log("value", PreOrderInfor);
          const res = await createPreOrder(PreOrderInfor);
          console.log("api create", res.data);
          if (res) {
            const newDate = new Date();
            const preDeposit = {
              preorderId: res.data.preorderId,
              productId: res.data.productId,
              shippingAddress: res.data.shippingAddress,
              memberId: res.data.memberId,
              quantity: res.data.quantity,
              preorderDate: newDate.toISOString(),
              total: Math.ceil(res.data.price - res.data.price * (1 - 15 / 100)),
              status: 0,
            };
            const memberID = res.data.memberId
            const resDeposit = await PreorderDeposit(preDeposit);
            console.log("api resDeposit", resDeposit.data);
            if (resDeposit) {
              const DepoDate = new Date()
              const dataCheckout = {
                preorderId: preDeposit.preorderId,
                productId: preDeposit.productId,
                shippingAddress: res.data.shippingAddress,
                memberId: memberID,
                quantity: Preorder.preOrderProduct.quantity,
                preorderDate: DepoDate.toISOString(),
                total: Math.ceil(resDeposit.data.amount) < 20000 ? Math.ceil(resDeposit.data.amount) * 100 : Math.ceil(resDeposit.data.amount),
                status: 0,
              };
              const VNpaycheckout = await VnpayCheckout(dataCheckout);
              if (VNpaycheckout) {
                const url = VNpaycheckout.data.paymentUrl
                window.open(url, "_blank");
              }
            }
          }
        } else if (!statePaymentMethod) {
          toast.error("Vui lòng chọn phương thức thanh toán vnpay", {
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.log("error payment page", error);
    }
  };

  const calculateTotalWithPromotin = (promotion) => {
    let total = state.total - state.total * (1 - promotion / 100);
    return total;
  };

  const calculateTotalPreOrderWithPromotin = (promotion) => {
    return (
      Preorder.totalPreOrder - Preorder.totalPreOrder * (1 - promotion / 100)
    );
  };
  // console.log("memberID",userProfile)
  // console.log("ddddddddddddddđ",preOrderAgain.total)
  return (
    <div className="payment-page container">
      <ToastContainer />
      <div className="payment-container">
        <div className="left-section">
          <div className="payment-method-section">
            <h2>Phương thức thanh toán</h2>
            <div className="payment-method">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  onClick={handPaymentOCD}
                />
                Thanh toán khi giao hàng (COD)
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="vnpay"
                  onClick={handPaymentVNP}
                />
                Thẻ ATM/Visa/Master/JCB/QR Pay qua cổng VNPAY
              </label>
              <img
                src="https://play-lh.googleusercontent.com/2WHgcuwhtbmfrDEF-D-lYQ4sAk0TlI-aFtqx7lJXK5KV7f8smnofaedP_Opcd3edR2c=w240-h480-rw"
                alt="VNPAY"
                width={50}
                height={50}
              />
            </div>
          </div>
        </div>
        <div className="right-section">
          <h2>Tóm tắt đơn hàng</h2>
          {actionPayment === "order" ? (
            <>
              {state.cartItems.map((item, index) => (
                <div className="product-summary" key={index}>
                  <img
                    src={`${urlImage}${item.images[0] ? item.images[0].imagePath : "productImage"
                      }`}
                    alt={item.productName}
                  />
                  <div className="product-info">
                    <p>{item.productName}</p>
                    <p>
                      {item.price.toLocaleString()} ₫ x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              <div
                className="promo-code"
                style={{ color: "#ff6f61", fontWeight: "bold" }}
              >
                đã được khuyến mãi{" "}
                {calculateTotalWithPromotin(
                  state.promotion.promotionValues
                ).toLocaleString()}
                % trên tổng giá
              </div>
              <div className="total-price">
                <span>Tạm tính:</span>
                <span>{state.total.toLocaleString()}₫</span>
              </div>

              <div className="total-price final-total">
                <span>Tổng cộng: </span>
                <span>{state.total.toLocaleString()} ₫</span>
              </div>
            </>
          ) : actionPayment === "PreorderAgain" ? (
            <>
              {preOrderAgain.products ? (
                <div className="product-summary">
                  <div className="product-info" >
                    <p style={{ fontWeight: "bold" }}>{preOrderAgain.products.productName}</p>
                    <p>{preOrderAgain.products.price.toLocaleString()} ₫  x{preOrderAgain.quantity}</p>
                  </div>
                </div>
              ) : (null)}

              <div
                className="promo-code"
                style={{ color: "#ff6f61", fontWeight: "bold" }}
              >
                đã được khuyến mãi{" "}
                {calculateTotalPreOrderWithPromotin(
                  Preorder.promotionPreorder.promotionValues
                    ? Preorder.promotionPreorder.promotionValues
                    : 1
                ).toLocaleString()}
                % trên tổng giá
              </div>
              <div className="total-price">
                <span>Tạm tính:</span>
                <span>{preOrderAgain.totalAmountBefore.toLocaleString()}₫</span>
              </div>

              <div className="total-price final-total">
                <span>Tổng cộng trả trước: </span>
                <span>{preOrderAgain.total.toLocaleString()} ₫</span>
              </div>
            </>
          ) : actionPayment === "orderAgain" ? (

            <>
              {orderAgain.product && orderAgain.product.length > 0 ? (
                orderAgain.product.map((product, index) => (
                  <div className="product-summary">
                    <div className="product-info" key={index}>
                      <p style={{ fontWeight: "bold" }}>{product.product.productName}</p>
                      <p>{product.price.toLocaleString()} ₫  x{product.quantity}</p>
                    </div>
                  </div>
                ))
              ) : (null)}

              <div
                className="promo-code"
                style={{ color: "#ff6f61", fontWeight: "bold" }}
              >
                đã được khuyến mãi{" "}
                {calculateTotalPreOrderWithPromotin(
                  Preorder.promotionPreorder.promotionValues
                    ? Preorder.promotionPreorder.promotionValues
                    : 1
                ).toLocaleString()}
                % trên tổng giá
              </div>
              <div className="total-price">
                <span>Tạm tính:</span>
                <span>{orderAgain.totalAmount.toLocaleString()}₫</span>
              </div>

              <div className="total-price final-total">
                <span>Tổng cộng: </span>
                <span>{orderAgain.totalAmount.toLocaleString()} ₫</span>
              </div>
            </>

          ) : (
            <>
              <div className="product-summary">
                <img
                  src={`${urlImage}${Preorder.preOrderProduct.images[0]
                    ? Preorder.preOrderProduct.images[0].imagePath
                    : "productImage"
                    }`}
                  alt={Preorder.preOrderProduct.productName}
                />
                <div className="product-info">
                  <p>{Preorder.preOrderProduct.productName}</p>
                  <p>{Preorder.preOrderProduct.price.toLocaleString()} ₫</p>
                </div>
              </div>
              <div
                className="promo-code"
                style={{ color: "#ff6f61", fontWeight: "bold" }}
              >
                đã được khuyến mãi{" "}
                {calculateTotalPreOrderWithPromotin(
                  Preorder.promotionPreorder.promotionValues
                    ? Preorder.promotionPreorder.promotionValues
                    : 1
                ).toLocaleString()}
                % trên tổng giá
              </div>
              <div className="total-price">
                <span>Tạm tính:</span>
                <span>{Preorder.totalPreOrder.toLocaleString()}₫</span>
              </div>

              <div className="total-price final-total">
                <span>Tổng cộng trả trước: </span>
                <span>{Math.ceil(Preorder.totalPreOrder * (15/100)).toLocaleString()} ₫</span>
              </div>
            </>
          )}
          <button className="complete-order-button" onClick={handlePayment}>
            Hoàn tất đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;


