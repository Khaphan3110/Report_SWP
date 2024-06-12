import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    deliveryMethod: 'delivery',
  });

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment');
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="checkout-page">
      <div className="breadcrumb">
        <a href="/">Trang chủ</a> / <a href="/cart">Giỏ hàng</a> / Thông tin giao hàng
      </div>
      <div className="checkout-container">
        <div className="shipping-info">
          <h2>Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleChange}
              required
            />
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={shippingInfo.phoneNumber}
              onChange={handleChange}
              required
            />
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleChange}
              required
            />
            <label>Tỉnh / Thành phố</label>
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
              required
            />
            <label>Quận / Huyện</label>
            <input
              type="text"
              name="district"
              value={shippingInfo.district}
              onChange={handleChange}
              required
            />
            <label>Phường / Xã</label>
            <input
              type="text"
              name="ward"
              value={shippingInfo.ward}
              onChange={handleChange}
              required
            />
            <button className="continue-button" type="submit">
              Tiếp tục đến phương thức thanh toán
            </button>
          </form>
        </div>
        <div className="order-summary">
          <h2>Tóm tắt đơn hàng</h2>
          {cartItems.map((item) => (
            <div className="product-summary" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="product-info">
                <p>{item.name}</p>
                <p>{item.price.toLocaleString()}₫ x {item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="discount-code">
            <label>Mã giảm giá</label>
            <input type="text" />
            <button>Áp dụng</button>
          </div>
          <div className="total-price">
            <span>Tổng cộng:</span>
            <span>{totalPrice.toLocaleString()}₫</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
