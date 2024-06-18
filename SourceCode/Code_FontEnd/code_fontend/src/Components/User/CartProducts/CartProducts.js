import React, { useEffect, useState } from "react";
import "./CartProducts.css";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { productGetAll } from "../../../Service/ProductService/ProductService";

import { Actions } from "../../../Store";
import { useStore } from "../../../Store";
import { imageGetAll } from "../../../Service/ProductService/imageService";
export default function CartProducts() {
  const [listProduct, setListProduct] = useState([]);
  const [listProductImage, setListProductImage] = useState([]);
  const [state,dispatch] = useStore();
  const [productID,setProductID] = useState('');
  useEffect(() => {
    const resProduct = async () => {
      const getProduct = await productGetAll();
      setListProduct(getProduct.data);
    };
    resProduct();
  }, []);

  useEffect(() => {
    const resImageProduct = async () => {
      const getProduct = await imageGetAll();
      setListProduct(getProduct.data);
    };
    resImageProduct();
  }, []);
  console.log("liaat hình ảnh",listProductImage)
 
  return (
    <Container>
      <Row >
        {listProduct.map((product, index) => {
          return (
            <Col xl={3} key={index} className="row-product-cart">
              <Card style={{ width: "18rem" }} className="cart-product-page">
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text>{product.price}đ</Card.Text>
                  <Button variant="primary" onClick={() => dispatch(Actions.addListToCart(product))}>Add To cart</Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
