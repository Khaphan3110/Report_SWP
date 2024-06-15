import React, { useEffect, useState } from "react";
import "./CartProducts.css";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { productGetAll } from "../../../Service/ProductService/ProductService";
export default function CartProducts() {
  const [listProduct, setListProduct] = useState([]);
  const [listProductImage, setListProductImage] = useState([]);

  useEffect(() => {
    const resProduct = async () => {
      const getProduct = await productGetAll();
      setListProduct(getProduct.data);
    };
    resProduct();
  }, []);
  return (
    <Container>
      <Row>
        {listProduct.map((product, index) => {
          return (
            <Col xl={3} key={index}>
              <Card style={{ width: "18rem" }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text>{product.price}đ</Card.Text>
                  <Button variant="primary">Add To cart</Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
