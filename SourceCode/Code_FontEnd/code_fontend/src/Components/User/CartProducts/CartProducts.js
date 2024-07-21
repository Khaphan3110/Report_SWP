import React, { useEffect, useState } from "react";
import "./CartProducts.css";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { productGetAll } from "../../../Service/ProductService/ProductService";

import { Actions, usePreorder, useProduct } from "../../../Store";
import { useStore } from "../../../Store";
import { imageGetAll } from "../../../Service/ProductService/imageService";
import HomePage from "../../../Pages/HomePage/HomePage";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { urlImage } from "../../../utility/CustomAxios";
export default function CartProducts({ listProduct, page }) {
  const [state, dispatch] = useStore();
  // const  {listProduct,getAllProductToContext } = useProduct();

  // useEffect(  () => {
  //   const getProduct = async () => {
  //     await getAllProductToContext(1,12)
  //   }
  //   getProduct();
  // },[])

  const [path, setPath] = useState();
  const {addProductToPreorder} = usePreorder()
  const navigator = useNavigate()
  const addToCart = (product) => {
    dispatch(Actions.addListToCart(product, 1));
    toast.success("sản phẩm đã được thêm", {
      autoClose: 1000,
    });
  };

  const preOrderProduct = (product) => {
    addProductToPreorder(product,1)
    navigator("/checkout/preorder");
  };

  // console.log("image",listProduct)
  return (
    <Container style={{ marginTop: "0" }}>
      <ToastContainer />
      {/* <HomePage/> */}
      <Row>
        {listProduct &&
          listProduct.map((product, index) => (
              product.images.length  > 0 ? (
                <Col key={index} className="row-product-cart">
                <Card className="cart-product-page">
                  {/* <Card.Img variant="top" src={listProductImage ? listProductImage[product.productId][0].imagePath : "productimage"} /> */}
                  <Link
                    to={`/productDetail/${product.productId}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Card.Img
                      variant="top"
                      src={`${urlImage}/${
                        product.images[0]
                          ? product.images[0].imagePath
                          : "productImage"
                      }`}
                      className="image-cart-product-user"
                    />
                  </Link>
                  <Card.Body>
                    <Link
                      to={`/productDetail/${product.productId}`}
                      style={{ textDecoration: "none", color: "black" }}
                      className="link-doc-product-page"
                    >
                      <Card.Text className="cart-product-text">
                        {product.productName}
                      </Card.Text>
                    </Link>
                    <Card.Text className="cart-product-text-money">
                      {product.price.toLocaleString()} đ
                    </Card.Text>
                    {product.statusDescription !== 0 ? (
                      <>
                        <button
                          variant="primary"
                          onClick={() =>
                            product.statusDescription === -1
                              ? preOrderProduct(product)
                              : addToCart(product)
                          }
                          className="button-cartProduct"
                        >
                          {product.statusDescription === -1
                            ? "Mua trước sản phẩm"
                            : "Thêm vào giỏ hàng"}
                        </button>
                        {product.statusDescription === -1 ? (
                          <p
                            style={{
                              color: "red",
                              margin: "0",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            sản phẩm chưa có
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
                  </Card.Body>
                </Card>
              </Col>
              ) : (
                // <p style={{color:"red",margin:"0"}}>Chỉ sản phẩm có hình mới được hiển thị</p>
               null
              )
          ))}
      </Row>
    </Container>
  );
}
