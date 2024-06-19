import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { useStore } from "../../../Store";
import { createOrder } from "../../../Service/OrderService/OrderService";

const PaymentPage = () => {
  const navigator = useNavigate();
  const [state] = useStore();
  const [statePaymentMethod, setstatePaymentMethod] = useState(null);
  const [formattedArray, setFormattedArray] = useState([]);
  const [orderInfor, setOrderInfor] = useState(null)

  const transformArray = () => {
    const transformedArray = state.cartItems.map((item) => ({
      productId : item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
    setFormattedArray(transformedArray);
  };

  // Gọi hàm biến đổi khi component được render
  useEffect(() => {
    transformArray();
  }, []);

  useEffect(() => {
    if (formattedArray.length > 0) {
      setOrderInfor({
        token: localStorage.getItem("userToken").slice(1, -1),
        shippingAddress: localStorage.getItem("shippingAdress"),
        promotionId: "PROMO001",
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
    if (statePaymentMethod === "cod") {
      const payMentOCD = await createOrder(orderInfor);
      if (payMentOCD) {
        alert("thanh toan thanh cong mua  hang tiep  nao");
        navigator("/");
      }
    } else if (statePaymentMethod === "vnpay") {
      alert("chua thuc  hien xong :))))()()()");
    }
  };
  return (
    <div className="payment-page container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / Giỏ hàng / Thông tin giao hàng / Phương
        thức thanh toán
      </div>
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
          {state.cartItems.map((item, index) => (
            <div className="product-summary" key={index}>
              <img src={item.image} alt={item.productName} />
              <div className="product-info">
                <p>{item.productName}</p>
                <p>
                  {item.price.toLocaleString()}₫ x {item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="promo-code">
            <input type="text" placeholder="Mã giảm giá" />
            <button>Sử dụng</button>
          </div>
          <div className="total-price">
            <span>Tạm tính:</span>
            <span>{state.total.toLocaleString()}₫</span>
          </div>

          <div className="total-price final-total">
            <span>Tổng cộng: </span>
            <span>{state.total.toLocaleString()} ₫</span>
          </div>
          <button className="complete-order-button" onClick={handlePayment}>
            Hoàn tất đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
