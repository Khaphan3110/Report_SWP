import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { Actions, useProduct, useStore } from "../../../Store";
import Payment from "../../../assets/images/policy_icon_1.jpg";
import Refunt from "../../../assets/images/refun_icon_2.png";
import Shipping from "../../../assets/images/shiping_icon_3.png";
import "./PreProductDetail.css";
import { toast } from "react-toastify";
export default function PreProductDetail({ productDetail }) {
  const [quantity, setquantity] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [state, dispatch] = useStore();
  const [currentImage, setCurrentImage] = useState(
    productDetail.images[0].imagePath
  );
  const [listImages, setListImages] = useState(productDetail.images);
  const [currentQuantity, setCurrentQuantity] = useState(
    productDetail.quantity
  );
  const handlePlusQuantity = () => {
    setquantity((preQuantiy) =>
      currentQuantity <= preQuantiy ? preQuantiy : preQuantiy + 1
    );
  };

  const handleMinusQuantity = () => {
    setquantity((prevQuantity) => {
      if (prevQuantity > 1) {
        return prevQuantity - 1;
      }
      return prevQuantity; // Giữ nguyên nếu quantity là 1
    });
  };

  const handleChangeBorderColor = (id) => {
    setSelectedId(id);
    setCurrentImage(listImages[id].imagePath);
  };


  const handAddProductTocart = () => {

      // dispatch(Actions.)
      dispatch(Actions.addListToCart(productDetail,quantity));
      // dispatch(Actions.addProduct.)
      toast.success("thêm sản phẩm thành công",{
        autoClose:500,
      })

  };

  console.log("list cart",state.cartItems)
  return (
    <>
      <>
        <Row>
          <Col xl={6}>
            <div className="product-detail-image">
              <img
                src={`https://localhost:44358/user-content/${
                  currentImage ? currentImage : "productImage"
                }`}
                alt="product_image"
                width={560}
                height={560}
              ></img>
              {listImages.length > 1 ? (
                <div className="group-image-product-detail">
                  <ul className="scrollable-images">
                    {listImages && listImages.length > 0
                      ? listImages.map((item, index) => (
                          <li
                            key={index}
                            style={{
                              width: "110px",
                              height: "115px",
                              border: `1px solid ${
                                selectedId === index ? "#f05a72" : "#d7d7d7"
                              }`,
                            }}
                            className="group-image-product-detail-one"
                            onClick={() => handleChangeBorderColor(index)}
                          >
                            <img
                              src={`https://localhost:44358/user-content/${
                                item.imagePath ? item.imagePath : "productImage"
                              }`}
                              alt="imagedetail"
                              width={100}
                              height={110}
                            ></img>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              ) : null}
            </div>
          </Col>

          <Col xl={6}>
            <div className="product-detail-wrapper-right">
              <h4>ProductName : {productDetail.productName}</h4>
              <p>Thương hiệu : {productDetail.brandName}</p>
              <p>Tình Trạng : {productDetail.statusDescription}</p>
              <div className="zone-charactor-wrapper">
                <span>Giao Hàng</span>
                <div className="zone-charactor-wrapper-detail">
                  <p>Toàn Quốc</p>
                </div>
              </div>
              <p className="money-product-detail">
                {productDetail.price.toLocaleString()} đ
              </p>

              <div className="quantity-detail-product">
                <span>Số lượng : {currentQuantity}</span>
                <div className="quantity-detail-active">
                  <p onClick={handleMinusQuantity}>
                    <FaCircleMinus />
                  </p>
                  <div className="input-quantity-product-detail">
                    <input readOnly value={quantity} name="quantity"></input>
                  </div>
                  <p onClick={handlePlusQuantity}>
                    <FaCirclePlus />
                  </p>
                </div>
              </div>
              <div className="active-product-buy-add">
                <button
                  className="active-product-add"
                  onClick={handAddProductTocart}
                >
                  <p>Thêm vào giỏ hàng</p>
                </button>
                {/* <button className="active-product-add">
                    <p>Mua ngay</p>
                </button> */}
              </div>
              <div className="polyci-product-detail">
                <div className="polyci-product-detail-payment">
                  <img
                    src={Payment}
                    alt="paymentImage"
                    width={31}
                    height={31}
                  ></img>
                  <div className="polyci-product-detail-charactor-wrapper">
                    <span>Thanh toán</span>
                    <p>
                      Thanh toán khi nhận hàng hoặc thông qua cổng thanh toán
                    </p>
                  </div>
                </div>
                <div className="polyci-product-detail-payment">
                  <img src={Refunt} alt="refun" width={31} height={31}></img>
                  <div className="polyci-product-detail-charactor-wrapper">
                    <span>Hoàn trả</span>
                    <p>
                      bạn chỉ được hủy đơn hàng trước khi thanh toán{" "}
                      <span>" bằng tiền mặt "</span> và trước khi được ship,
                      thanh toán bằng VNpay không thể hủy đơn hàng
                    </p>
                  </div>
                </div>
                <div className="polyci-product-detail-payment">
                  <img
                    src={Shipping}
                    alt="shipping"
                    width={31}
                    height={31}
                  ></img>
                  <div className="polyci-product-detail-charactor-wrapper">
                    <span>Vận chuyển</span>
                    <p>Miễn phí ship nội bộ Việt Nam</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <div className="footer-pre-product-detail">
            <p className="header-preProductDetail">MÔ TẢ SẢN PHẨM</p>
            <p>{productDetail.description}</p>
          </div>
        </Row>
      </>
    </>
  );
}
