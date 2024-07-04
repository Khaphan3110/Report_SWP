import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./PreProductDetail.css";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import Payment from "../../../assets/images/policy_icon_1.jpg";
import Refunt from "../../../assets/images/refun_icon_2.png";
import Shipping from "../../../assets/images/shiping_icon_3.png";
import { toast } from "react-toastify";
import { useFormik } from "formik";
export default function PreProductDetail({ productDetail }) {
  const [quantity, setquantity] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  
  const items = [1, 2, 2,2,5];
  const listImage = [
    "https://product.hstatic.net/1000186075/product/banh-quy-crown-soboro-cracker-60g_6772eb9d42af478688ead714d40e8b13_master.jpg",
    "https://product.hstatic.net/1000186075/product/2705005600-2-combo-2-lon-thuc-pham-dinh-duong-meiji-so-9-800g-1-3-tuoi_ea7688c51ce944e898c07fc0bf714fa4_large.jpg",
    "https://via.placeholder.com/560x560?text=Image+3",
    "https://via.placeholder.com/560x560?text=Image+4",
    "https://via.placeholder.com/560x560?text=Image+5",
  ];
  
  const [currentImage,setCurrentImage] = useState(listImage[0])
  const handlePlusQuantity = () => {
    setquantity((preQuantiy) => preQuantiy + 1);
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
    setCurrentImage(listImage[id])
  };

  return (
    <>
      <Row>
        <Col xl={6}>
          <div className="product-detail-image">
            <img
              src={currentImage}
              alt="product_image"
              width={560}
              height={560}
            ></img>
            <div className="group-image-product-detail">
              <ul>
                {items &&
                  items.map((item, index) => (
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
                     <img src={currentImage} alt="imagedetail" width={100}
                     height={110}></img> 
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Col>

        <Col xl={6}>
          <div className="product-detail-wrapper-right">
            <h1>ProductName</h1>
            <p>Thương hiệu : </p>
            <p>Tình Trạng : </p>
            <div className="zone-charactor-wrapper">
              <span>Giao Hàng</span>
              <div className="zone-charactor-wrapper-detail">
                <p>Toàn Quốc</p>
              </div>
            </div>
            <p className="money-product-detail">1111111111 đ</p>

            <div className="quantity-detail-product">
              <span>Số lượng :</span>
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
              <button className="active-product-add">
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
                  <p>Thanh toán khi nhận hàng hoặc thông qua cổng thanh toán</p>
                </div>
              </div>
              <div className="polyci-product-detail-payment">
                <img src={Refunt} alt="refun" width={31} height={31}></img>
                <div className="polyci-product-detail-charactor-wrapper">
                  <span>Hoàn trả</span>
                  <p>
                    bạn chỉ được hủy đơn hàng trước khi thanh toán{" "}
                    <span>" bằng tiền mặt "</span> và trước khi được ship, thanh
                    toán bằng VNpay không thể hủy đơn hàng
                  </p>
                </div>
              </div>
              <div className="polyci-product-detail-payment">
                <img src={Shipping} alt="shipping" width={31} height={31}></img>
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
        <div>
          <p className="header-preProductDetail">MÔ TẢ SẢN PHẨM</p>
          <p>
            Sữa mẹ là thức ăn tốt nhất cho sức khỏe và sự phát triển toàn diện
            của trẻ nhỏ Thực phẩm dinh dưỡng Aptamil Đức 800g số 3 Đối tượng sử
            dụng: Dùng cho bé từ 12 tháng tuổi Lưu ý: Chỉ sử dụng sản phẩm này
            theo chỉ dẫn của bác sĩ. Pha chế theo đúng hướng dẫn. Cho trẻ ăn
            bằng cốc, thìa hợp vệ sinh. - Vệ sinh tay và dụng cụ pha chế trước
            khi sử dụng Cách sử dụng: Cần theo dõi chính xác tình trạng sức khỏe
            của bé và pha theo đúng liều lượng hướng dẫn của nhà sản xuất. Không
            hâm nóng lại sản phẩm đã pha trong lò vi sóng. Cách pha: (Mỗi muỗng
            pha cùng với 30ml nước) 1. Rửa tay trước khi pha sữa 2. Tiệt trùng
            sạch bình, cốc pha và các dụng cụ pha khác. 3. Đun sôi nước và sau
            đó để nguội xuống 40 độ C 4. Dựa theo bảng hướng dẫn, rót 2/3 lượng
            nước vào bình 5. Sử dụng muỗng đong trong hộp, mỗi muỗng múc không
            quá đầy (gạt bằng miệng muỗng). Một muỗng gạt tương đương 4.9g 6.
            Lắc bình, sau đó đổ thêm 1/3 lượng nước cần pha còn lại vào bình.
            Lắc tiếp cho đến khi bột hòa tan hoàn toàn. 7. Kiểm tra lại nhiệt độ
            trước khi cho bé sử dụng (Nhiệt độ lý tưởng là 37 độ C)
          </p>
        </div>
      </Row>
    </>
  );
}
