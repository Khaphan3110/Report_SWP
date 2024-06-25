import React, { useEffect, useState } from "react";
import "./CartProducts.css";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { productGetAll } from "../../../Service/ProductService/ProductService";

import { Actions, useProduct } from "../../../Store";
import { useStore } from "../../../Store";
import { imageGetAll } from "../../../Service/ProductService/imageService";
export default function CartProducts() {

  const [state, dispatch] = useStore();
  const  {listProduct,getAllProductToContext } = useProduct();

  useEffect(  () => {
    const getProduct = async () => {
      await getAllProductToContext(1,12)
    }
    getProduct(); 
  },[])


 
  return (
    <Container>
      <Row>
        {listProduct && listProduct.map((product, index) => {
          return (
            <Col xl={3} key={index} className="row-product-cart">
              <Card style={{ width: "18rem" }} className="cart-product-page">
                {/* <Card.Img variant="top" src={listProductImage ? listProductImage[product.productId][0].imagePath : "productimage"} /> */}
                <Card.Img variant="top" src={`https://localhost:44358/user-content/${product.images[0] ? product.images[0].imagePath : "productImage"}`} />
                <Card.Body>
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text>{product.price}đ</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => dispatch(Actions.addListToCart(product))}
                  >
                    Add To cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
