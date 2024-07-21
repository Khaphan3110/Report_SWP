import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CartPage.css";
import { Actions } from "../../../Store";
import { useStore } from "../../../Store";
import cartEmpty from "../../../assets/images/cart_empty_background.png";
import { urlImage } from "../../../utility/CustomAxios";
const CartPage = () => {
  const [state, dispatch] = useStore();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Combo 2 Ion Thực phẩm dinh dưỡng Meiji số 9 800g 1 - 3 tuổi",
      price: 900000,
      quantity: 1,
      image:
        "https://tse4.mm.bing.net/th?id=OIP.E1DyiEUNLJcx-UvjKKdNkwHaHa&pid=Api&P=0&h=180",
    },
    {
      id: 2,
      name: "Sữa bột Abbott Grow Gold số 4 900g cho trẻ 2-6 tuổi",
      price: 500000,
      quantity: 1,
      image:
        "https://bizweb.dktcdn.net/100/172/234/products/sua-bot-abbott-grow-gold-3-huong-vani-400g-1502939576-4289062-1559d640cd84f525e2cec0a2981a2b4a.jpg?v=1514607202967",
    },
  ]);

  // useEffect(() => {
  //   // Save cart items to localStorage
  //   localStorage.setItem('cartItems', JSON.stringify(cartItems));
  // }, [cartItems]);

  const handleQuantityChange = (itemId, delta) => {
    dispatch(Actions.increaseQuantity(itemId, delta));
  };

  // const handleRemoveItem = (itemId) => {
  //   // setCartItems(cartItems.filter(item => item.id !== itemId));
  // };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const calculateTotalWithPromotin = (promotion) => {
     let total = state.total - state.total * (1 - promotion / 100);
     return total
  };
  console.log("cartpage", state.cartItems);
  return (
    <div className="cart-page container">
      {/* <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / Giỏ hàng 
      </div> */}
      {(() => {
        if (state.cartItems.length !== 0) {
          return (
            <div className="cart-container">
              <div className="cart-content">
                <h2>Giỏ hàng</h2>
                {state.cartItems.map((item, index) => (
                  <div className="cart-item" key={index}>
                    <img
                      src={`${urlImage}${
                        item.images[0]
                          ? item.images[0].imagePath
                          : "productImage"
                      }`}
                      alt={item.productName}
                    />
                    <div className="cart-item-details">
                      <h3>{item.productName}</h3>
                      <p className="cart-item-price">
                        {item.price.toLocaleString()}₫
                      </p>
                      <div className="quantity-controls-cartPage">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, -1)
                          }
                        >
                          -
                        </button>
                        <input type="text" value={item.quantity} readOnly />
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() =>
                        dispatch(Actions.removeProductToCart(item))
                      }
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div className="payment-info">
                <div className="invoice-option">
                  <input type="checkbox" id="invoice" />
                  <label htmlFor="invoice">Xuất hóa đơn công ty</label>
                </div>
                <div className="total-price">
                  <div className="promotion-values-cart">
                    <span>TỔNG CỘNG: </span>
                    <p style={{ margin: "0" }}>
                      {state.total.toLocaleString()} đ
                    </p>
                  </div>
                  <span style={{ color: "#ff6f61", fontWeight: "bold" }}>
                    đã được khuyến mãi {calculateTotalWithPromotin(state.promotion.promotionValues).toLocaleString()}đ trên
                    tổng giá
                  </span>

                  <p>(Đã bao gồm VAT nếu có)</p>
                </div>
                {/* <div className="discount-code">
                  <span>Mã giảm giá</span>
                  <Link to="/discount">Chọn mã giảm giá</Link>
                </div> */}
                <Link to="/checkout/order" className="checkout-button">
                  Thanh Toán
                </Link>
                <div className="payment-methods">
                  <h4>Hình thức thanh toán</h4>
                  <img
                    src="https://tse3.mm.bing.net/th?id=OIP.FsfqOWtwUfPKv44mVE60eQHaB4&pid=Api&P=0&h=180"
                    alt="Payment Methods"
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="cart-blank">
              <div className="cart-blank-picture">
                <img
                  src={cartEmpty}
                  width={298}
                  height={152}
                  alt="cart_emtpy"
                />
              </div>
              <h2>Giỏ hàng đang trống</h2>
              <span>Mời ní mua đồ tiếp đi rồi quay lại</span>
              <p>
                <Link to={"/"}>
                  <button
                    className="button-cart-empty"
                    style={{ outline: "none" }}
                  >
                    Mua Sắm nào
                  </button>
                </Link>
              </p>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default CartPage;
