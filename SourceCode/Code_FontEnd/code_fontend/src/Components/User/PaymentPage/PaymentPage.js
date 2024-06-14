import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const finalTotal = totalPrice;

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
                <input type="radio" name="payment" value="cod" />
                Thanh toán khi giao hàng (COD)
              </label>
              <label>
                <input type="radio" name="payment" value="vnpay" />
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
          {cartItems.map((item) => (
            <div className="product-summary" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="product-info">
                <p>{item.name}</p>
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
            <span>{totalPrice.toLocaleString()}₫</span>
          </div>

          <div className="total-price final-total">
            <span>Tổng cộng:</span>
            <span>{finalTotal.toLocaleString()}₫</span>
          </div>
          <button className="complete-order-button">Hoàn tất đơn hàng</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
