import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import PreProductDetail from "./PreProductDetail";

export default function ProductDetail() {
    const list = []
  return (
    <Container style={{marginTop:"1%",marginBottom:"1%"}}>
        <PreProductDetail productDetail = {list}/>
    </Container>
   
  );
}
