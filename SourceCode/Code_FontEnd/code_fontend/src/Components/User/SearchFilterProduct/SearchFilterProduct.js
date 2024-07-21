import React from "react";
import "./SearchFilterProduct.css";
import { Col, Container, Row } from "react-bootstrap";
import CartProducts from "../CartProducts/CartProducts";
import { useParams } from "react-router-dom";
export default function SearchFilterProduct() {
  const list = [];
  const paramSearch = useParams();
  console.log("param search",paramSearch)
  return (
    <Container className="search-product-wraper">
      <Row style={{height:"100vh"}}>
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
          <div className="search-product-wraper-right">
              <h4>Sữa được tìm kiếm</h4>
              <div className="filter-product-search-right">
                  
                  <ul className="nav-search-fillter-right">
                    <li>Sắp Xếp: </li>
                    <li> Từ A - Z</li>
                    <li> Từ Z - A</li>
                    <li>Giá tăng dần</li>
                    <li>Giá giảm dần</li>
                  </ul>
                  {list && list.lenght > 0 ? 
                  (<CartProducts listProduct={list}/>)
                   : 
                   (<div><h2 style={{textAlign:"center"}}>Kh có sản phẩm nào phù hợp với kết quả tìm kiếm</h2></div>)}
                  
              </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
