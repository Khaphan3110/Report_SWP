import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./PaymentPage.css";
import { Actions, usePreorder, useStore, useUserProfile } from "../../../Store";
import {
  checkoutPay,
  createOrder,
  paymentCallBack,
} from "../../../Service/OrderService/OrderService";
import { toast, ToastContainer } from "react-toastify";
import {
  createPreOrder,
  PreorderDeposit,
  VnpayCheckout,
} from "../../../Service/PreorderService/PreorderService";

const PaymentPage = () => {
  const navigator = useNavigate();
  const [state, dispatch] = useStore();
  const [statePaymentMethod, setstatePaymentMethod] = useState("");
  const [formattedArray, setFormattedArray] = useState([]);
  const [orderInfor, setOrderInfor] = useState(null);
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
        totalAmount: state.total,
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
    alert("vô");
    console.log("action", actionPayment);
    try {
      if (actionPayment === "order") {
        if (statePaymentMethod === "cod") {
          alert("chua thuc  hien xong :))))()()()");
        } else if (statePaymentMethod === "vnpay") {
          const payMentOCD = await createOrder(orderInfor);
          if (payMentOCD) {
            console.log("order", payMentOCD.data);
            const orderInfor = {
              orderId: payMentOCD.data.order.orderId,
              memberId: payMentOCD.data.order.memberId,
              promotionId: payMentOCD.data.order.promotionId,
              shippingAddress: payMentOCD.data.order.shippingAddress,
              totalAmount: payMentOCD.data.order.totalAmount,
              orderStatus: payMentOCD.data.order.orderStatus,
              orderDate: payMentOCD.data.order.orderDate,
            };
            const payMentVNPAY = await checkoutPay(
              userProfile.userToken,
              orderInfor
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
      } else {
        if (statePaymentMethod === "cod") {
          alert("chua thuc  hien xong :))))()()()");
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
            total: Preorder.totalPreOrder,
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
              shippingAddress:res.data.shippingAddress,
              memberId: res.data.memberId,
              quantity: res.data.quantity,
              preorderDate: newDate.toISOString(),
              total: res.data.price - res.data.price * (1 - 15 / 100),
              status: 0,
            };
            const memberID = res.data.memberId
            const resDeposit = await PreorderDeposit(preDeposit);
            console.log("api resDeposit", resDeposit.data);
            if (resDeposit) {
              const DepoDate = new Date()
              const dataCheckout = {
                preorderId: resDeposit.data.preorderId,
                productId: Preorder.preOrderProduct.productId,
                shippingAddress:res.data.shippingAddress,
                memberId: memberID,
                quantity: Preorder.preOrderProduct.quantity,
                preorderDate: DepoDate.toISOString(),
                total: resDeposit.data.amount,
                status: 0,
              };
              const VNpaycheckout = await VnpayCheckout(dataCheckout);
              if(VNpaycheckout){
                const url = VNpaycheckout.data.paymentUrl
                window.open(url, "_blank");
              }
            }
          }
        } else if (!statePaymentMethod) {
          toast.error("Vui lòng chọn phương thức thanh toán ", {
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
                    src={`https://localhost:44358/user-content/${
                      item.images[0] ? item.images[0].imagePath : "productImage"
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
          ) : (
            <>
              <div className="product-summary">
                <img
                  src={`https://localhost:44358/user-content/${
                    Preorder.preOrderProduct.images[0]
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
                <span>Tổng cộng: </span>
                <span>{Preorder.totalPreOrder.toLocaleString()} ₫</span>
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
