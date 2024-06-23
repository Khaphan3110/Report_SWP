import React, { useEffect, useState } from "react";
import "./CartProducts.css";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { productGetAll } from "../../../Service/ProductService/ProductService";

import { Actions } from "../../../Store";
import { useStore } from "../../../Store";
import { imageGetAll } from "../../../Service/ProductService/imageService";
export default function CartProducts() {
  const [listProduct, setListProduct] = useState([]);
  const [listProductImage, setListProductImage] = useState({});
  const [state, dispatch] = useStore();
  useEffect(() => {
    const resProduct = async () => {
      const getProduct = await productGetAll();
      if (getProduct) {
        setListProduct(getProduct.data);
      }
    };
    resProduct();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const imageMap = {};
      for (let product of listProduct) {
        const getProductImage = await imageGetAll(product.productId);
        if (getProductImage) {
          imageMap[product.productId] = getProductImage.data;
        }
      }
      setListProductImage(imageMap);
    };

    if (listProduct.length > 0) {
      fetchImages();
    }
  }, [listProduct]);
  console.log("liaat hình ảnh", listProductImage["PM0624001"]);

  return (
    <Container>
      <Row>
        {listProduct.map((product, index) => {
          return (
            <Col xl={3} key={index} className="row-product-cart">
              <Card style={{ width: "18rem" }} className="cart-product-page">
                {/* <Card.Img variant="top" src={listProductImage ? listProductImage[product.productId][0].imagePath : "productimage"} /> */}
                <Card.Img variant="top" src="" />
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
