import React from "react";
import "./SearchFilterProduct.css";
import { Col, Container, Row } from "react-bootstrap";
export default function SearchFilterProduct() {
  return (
    <Container className="search-product-wraper">
      <Row>
        <Col xl={2}>
          <div className="filter-product-search">
            <h5>MỨC GIÁ</h5>
            <div className="filter-check-box-product">
                <input type="checkbox"></input>
                <p>Giá dưới 100,000₫</p>
            </div>
            <div  className="filter-check-box-product">
                <input type="checkbox"></input>
                <p>100,000₫ - 300,000₫</p>
            </div>
            <div  className="filter-check-box-product">
                <input type="checkbox"></input>
                <p>300,000₫ - 500,000₫</p>
            </div>
            <div  className="filter-check-box-product">
                <input type="checkbox"></input>
                <p>500,000₫ - 1,000,000₫</p>
            </div>
            <div  className="filter-check-box-product">
                <input type="checkbox"></input>
                <p>500,000₫ - 1,000,000₫</p>
            </div>
            <div  className="filter-check-box-product">
                <input type="checkbox"></input>
                <p>Giá trên 3,000,000₫</p>
            </div>
          </div>
        </Col>
        <Col xl={10}>
          <h2>bla</h2>
        </Col>
      </Row>
    </Container>
  );
}
