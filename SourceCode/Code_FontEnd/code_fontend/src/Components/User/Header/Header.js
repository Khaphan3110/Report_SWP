import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import blogImage from "../../../assets/images/blogImage.png";
import cartIcon from "../../../assets/images/carticon.png";
import memberIconDiscount from "../../../assets/images/forMember.png";
import phoneIcon from "../../../assets/images/phoneicon.jpg";
import shipIcon from "../../../assets/images/shippingIcon.png";
import "./Header.css";
import accountIcon from "../../../assets/images/account-icon.png";
import { useStore, useUserProfile } from "../../../Store";
import { Tooltip } from "react-tooltip";
import { cateGetAllNoPaginate } from "../../../Service/CateService/CateService";

export default function Header() {
  const userInfor = JSON.parse(localStorage.getItem("userValue"));
  const [showToolip, setShowToolip] = useState(false);
  const [state, dispatch] = useStore();
  const prevCartItemsCount = useRef(state.cartItems.length);
  const { userProfile } = useUserProfile();
  const [listCate, SetListCate] = useState();
  //state.statusAddTocart === true
  useEffect(() => {
    const showTOOLIP = () => {
      if (state.cartItems.length > prevCartItemsCount.current) {
        setShowToolip(true);
        setTimeout(() => {
          setShowToolip(false);
        }, 2000);
      }
    };
    showTOOLIP();
    prevCartItemsCount.current = state.cartItems.length;
  }, [state.cartItems]);

  useEffect(() => {
    const getCate = async () => {
      const res = await cateGetAllNoPaginate();
      SetListCate(res.data);
    };
    getCate();
  }, []);
  return (
    <>
      <header className="header-menu">
        <div className="mid-header wid_100 d-flex align-items-center">
          <div className="container">
            <div className="row row align-items-center">
              <div className="col-3 header-right d-lg-none d-block">
                <div className="toggle-nav btn menu-bar mr-4 ml-0 p-0  d-lg-none d-flex text-white">
                  <span>Bar</span>
                  <span>Bar</span>
                  <span>Bar</span>
                </div>
              </div>
              <div className="col-6 col-xl-3 col-lg-3 header-left-homepage">
                <Link to={"/"}>
                  <img
                    src="https://theme.hstatic.net/1000186075/1000909086/14/logo.png?v=4468"
                    alt="logoMilkStore"
                    width={248}
                    height={53}
                    style={{ backgroundColor: "#F05A72" }}
                  ></img>
                </Link>
              </div>
              <div className="header-center col-xl-4 col-lg-4 col-12 ">
                <form>
                  <input
                    type="text"
                    name="search"
                    data-placeholder="sữa mẹ;sữa con"
                    placeholder="nhập tên sản phẩm..."
                  ></input>
                  <input type="hidden" name="type" value={"???"}></input>
                  <span className="icon-search">
                    <button>
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </span>
                </form>
              </div>
              <div className="col-3 col-xl-5 col-lg-5 ">
                <ul className="header-right mb-0 float-right list-unstyled  d-flex align-items-center ">
                  <li className="contact">
                    <img
                      src={phoneIcon}
                      alt="icon-contact"
                      width={32}
                      height={32}
                    ></img>
                    <div className="contact-infor">
                      <span>Tư vấn khác hàng</span>
                      <br></br>
                      <span className="std">1900 8078</span>
                    </div>
                  </li>
                  <li className="user d-block d-flex">
                    <img
                      src={accountIcon}
                      alt="hình ảnh user"
                      width={32}
                      height={32}
                    ></img>
                    <div className="userAcount d-md-flex flex-column d-none ">
                      <Link to={"/account"}>Tài Khoản</Link>
                      {userProfile.userToken &&
                      userProfile.userToken.length > 0 ? (
                        <small>
                          <Link to={"/logout"}>Đăng xuất</Link>
                        </small>
                      ) : (
                        <small>
                          <Link to={"/login"}>Đăng nhập</Link>
                        </small>
                      )}
                    </div>
                  </li>
                  <li className="cart">
                    <div>
                      <Link to={"/Cart"} className="cart-link">
                        <img
                          src={cartIcon}
                          alt="cartImge"
                          width={32}
                          height={32}
                        ></img>
                        <span className="cart-name">Giỏ Hàng</span>
                        <span
                          className="cart-quantity"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Sản phẩm đã được thêm"
                          data-tooltip-place="bottom"
                          data-tooltip-variant="success"
                        >
                          {state.cartItems.length}
                        </span>
                      </Link>
                      {/* <Tooltip id="my-tooltip" isOpen={showToolip}></Tooltip> */}
                      {showToolip !== false && (
                        <Tooltip
                          id="my-tooltip"
                          isOpen={true}
                          className="toolip-cart"
                        ></Tooltip>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="sub-Header-homepage">
        <div className="container wrapper-subHeader">
          <div className="toogle-nav-wrapper-content-wrapper">
            <div className="toogle-nav-wrapper-content">
              <div className="toogle-nav-wrapper">
                <div className="icon-bar-header btn menu-bar mr-2  p-0 d-inline-flex">
                  <i className="fa-solid fa-bars"></i>
                </div>
                <h6
                  style={{
                    margin: "0",
                    paddingLeft: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Danh mục sản phẩm
                </h6>
              </div>
              <div className="navbar-link-header-header">
                <ul>
                  {listCate
                    ? listCate.map((cate, index) => (
                        <Link
                          to={`/seachproduct/${cate.categoriesId}`}
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          <li key={index} className="cate-type-product">
                            <img
                              src="https://theme.hstatic.net/1000186075/1000909086/14/menu_icon_1.png?v=4490"
                              alt="icon milk"
                              width={24}
                              height={24}
                            ></img>{" "}
                            {cate.brandName}
                          </li>
                        </Link>
                      ))
                    : "danh sách sản phẩm"}
                </ul>
              </div>
            </div>
          </div>
          <ul className="shop-policy">
            <li>
              <div>
                <img
                  src={shipIcon}
                  alt="anh giao hang"
                  width={32}
                  height={32}
                ></img>
              </div>
              <Link to={"/policy"}>Chính sách giao hàng</Link>
            </li>
            <li>
              <div>
                <img
                  src={memberIconDiscount}
                  alt="ưu đãi thành viên"
                  width={32}
                  height={32}
                ></img>
              </div>
              <a href="#">Ưu đãi thành viên</a>
            </li>
            <li>
              <div>
                <img src={blogImage} alt="blog" width={32} height={32}></img>
              </div>
              <Link to={"/blog"}>Blog nhà milk</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
