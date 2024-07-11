import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Success.css";
import { Link, Navigate } from "react-router-dom";
import { Actions, useStore } from "../../../../Store";
export default function Success() {
  const [state,dispatch] = useStore()
  useEffect(() => {
    dispatch(Actions.clearListToCart())
  },[])
  return (
    <Container>
      <Row>
        <Col className="success-payment-user">
          <div className="success-payment-wraper">
            <div className="success-payment-image">
              <img
                src="https://png.pngtree.com/png-vector/20220430/ourmid/pngtree-glitter-mark-and-check-mark-icon-vectors-successful-form-illustration-vector-png-image_45447812.jpg"
                alt="Success"
              ></img>
            </div>
            <h5>Cám ơn đã mua hàng</h5>
            <button className="success-payment-button">
              <Link to={"/"} className="link-sucess-payment">
                {" "}
                <p>Mua sắm tiếp nào</p>
              </Link>
            </button>
          </div>
        </Col>
        <div class="firework"></div>
        <div class="firework"></div>
        <div class="firework"></div>
        <div class="firework"></div>
        <div class="firework"></div>
        <div class="firework"></div>
      </Row>
    </Container>
  );
}
