import Rating from "@mui/material/Rating";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { Actions, usePreorder, useStore } from "../../../Store";
import Payment from "../../../assets/images/policy_icon_1.jpg";
import Refunt from "../../../assets/images/refun_icon_2.png";
import Shipping from "../../../assets/images/shiping_icon_3.png";
import "./PreProductDetail.css";
import { getProductReviewPaging } from "../../../Service/ProductService/ProductService";
import { useNavigate } from "react-router-dom";
import { urlImage } from "../../../utility/CustomAxios";
export default function PreProductDetail({ productDetail }) {
  const [quantity, setquantity] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [state, dispatch] = useStore();
  const [pageIndex, setpageIndex] = useState(1)
  const [listReview, setlistReview] = useState([])
  const {addProductToPreorder} = usePreorder()
  const [currentImage, setCurrentImage] = useState(
    productDetail.images[0].imagePath
  );
  const [pageCount, setPageCount] = useState()
  const [totalRecord, setTotalRecord] = useState()
  const [listImages, setListImages] = useState(productDetail.images);
  const [currentQuantity, setCurrentQuantity] = useState(
    productDetail.quantity
  );

  const navigator = useNavigate()

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
    toast.success("thêm sản phẩm thành công", {
      autoClose: 500,
    });
    dispatch(Actions.addListToCart(productDetail, quantity));
    // dispatch(Actions.addProduct.)
    
  };

  // console.log("list cart",  state.cartItems);
  const handleAddPreorder = () => {
    const newProduct = {
      categoriesId: productDetail.categoriesId,
      description: productDetail.description,
      images: productDetail.images,
      price: productDetail.price,
      productId: productDetail.productId,
      productName: productDetail.productName,
      statusDescription: productDetail.statusDescription,
    }
    addProductToPreorder(newProduct,quantity)
    navigator("/checkout/preorder");
  };
  // console.log("product", productDetail);

  const GetReviewProductPaging = async () => {
    try {
      const res = await getProductReviewPaging(productDetail.productId, pageIndex, 5);
      // console.log("res", res)
      if (res) {
        setPageCount(res.data.pageCount)
        setTotalRecord(res.data.totalRecords)
        const existingReviewIds = new Set(listReview.map(review => review.reviewId));
        // console.log("pre",existingReviewIds)
        // Lọc ra các review mới không có trong existingReviewIds
        const newReviews = res.data.items.filter(review => !existingReviewIds.has(review.reviewId));
        // console.log("after",newReviews)
        // Cập nhật listReview với các review mới
        if (listReview.length > 0) {
          setlistReview(prevReviews => [...prevReviews, ...newReviews]);
        } else {
          setlistReview(newReviews);
        }
      }
    } catch (error) {
      console.log("error paging product review", error);
    }
  };

  const handChangePageIndexReview = () => {
    if (listReview.length !== totalRecord) {
      setpageIndex(pre => pre + 1)
    }
  }
  useEffect(() => {
    GetReviewProductPaging()
  }, [pageIndex])
  // console.log("listreview", listReview)

  const handChangePageIndexReviewDecreate = async () => {
    setpageIndex(1)
    try {
      const res = await getProductReviewPaging(productDetail.productId, 1, 5);
      if (res) {
        setPageCount(res.data.pageCount)
        setTotalRecord(res.data.totalRecords)
        setlistReview(res.data.items);
        // console.log("item ẩn bớt",res.data.items)
      }
    } catch (error) {
      console.log('error ẩn bớt', error)
    }
    
  }
  console.log("product",productDetail)
  return (
    <>
      <>
        <Row>
          <ToastContainer/>
          <Col xl={6}>
            <div className="product-detail-image">
              <img
                src={`${urlImage}${currentImage ? currentImage : "productImage"
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
                            border: `1px solid ${selectedId === index ? "#f05a72" : "#d7d7d7"
                              }`,
                          }}
                          className="group-image-product-detail-one"
                          onClick={() => handleChangeBorderColor(index)}
                        >
                          <img
                            src={`${urlImage}${item.imagePath ? item.imagePath : "productImage"
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
              <p>
                Thương hiệu :{" "}
                <span style={{ fontWeight: "bold" }}>
                  {productDetail.category.brandName}
                </span>
              </p>
              <p>
                Tình Trạng :{" "}
                {productDetail.statusDescription === 1
                  ? "Còn hàng"
                  : productDetail.statusDescription === 0
                    ? "Hết Hàng"
                    : "Chưa có hàng"}
              </p>
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
                <span style={{ fontWeight: "bold" }}>
                  Số lượng : {currentQuantity}
                </span>
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
                {productDetail.statusDescription !== 0 ? (
                  <>
                    <button
                      className="active-product-add"
                      onClick={() =>
                        productDetail.statusDescription === -1
                          ? handleAddPreorder()
                          : handAddProductTocart()
                      }
                    >
                      <p>
                        {productDetail.statusDescription === -1
                          ? "Mua trước sản phẩm"
                          : "Thêm vào giỏ hàng"}
                      </p>
                    </button>
                    {productDetail.statusDescription === -1 ? (
                      <p
                        style={{
                          color: "red",
                          margin: "0",
                          textAlign: "center",
                          fontWeight: "bold",
                          alignContent: "center",
                        }}
                      >
                        Sản phẩm chưa có hàng
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p
                    style={{
                      color: "red",
                      margin: "0",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Sản phẩm đã hết hàng
                  </p>
                )}

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
          <div className="review-from-member-buy">
            <p className="header-preProductDetail">Đánh Giá Sản Phẩm</p>

            {listReview && listReview.length > 0 ? (
              <>
                {listReview.map((review, index) => (
                  <div className="reivew-detail-wiht-any-member" key={index}>
                    <div style={{ padding: "10px" }}>
                      <p className="name-reviewer">
                        {" "}
                        Tên : {productDetail.member.lastName}{" "}
                        {productDetail.member.firstName}
                      </p>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <p style={{ margin: "0", fontWeight: "bold" }}>
                          Đánh giá :
                        </p>
                        <Rating name="read-only" value={review.grade} />
                      </div>
                      <div className="description-review">
                        <p
                          style={{
                            margin: "0",
                            fontWeight: "bold",
                            width: "100px",
                            flex: "1",
                          }}
                        >
                          Bình luận :
                        </p>
                        <p
                          style={{
                            margin: "0",
                            wordBreak: "break-word",
                            flex: "14",
                          }}
                        >
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {pageCount > 1 && listReview.length < totalRecord ? (<h5 style={{ textAlign: "center" }} className="click-see-more-product" onClick={handChangePageIndexReview}>Xem thêm....</h5>) : (<h5 style={{ textAlign: "center" }} className="click-see-more-product" onClick={handChangePageIndexReviewDecreate}>Ẩn bớt</h5>)}
              </>
            ) : (
              <div style={{ margin: "0 auto" }}>
                <p
                  style={{
                    margin: "10px auto",
                    fontWeight: "bold",
                    fontSize: "500",
                    textAlign: "center",
                  }}
                >
                  Sản phẩm chưa có lược đánh giá nào cả
                </p>
              </div>
            )}
          </div>
        </Row>
      </>
    </>
  );
}
