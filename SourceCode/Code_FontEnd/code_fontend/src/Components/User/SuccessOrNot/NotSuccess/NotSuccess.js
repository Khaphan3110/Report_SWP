import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "./NotSuccess.css"
export default function NotSuccess() {
  return (
    <Container>
      <Row>
        <Col className="Not-success-payment-user">
          <div className="Not-success-payment-wraper">
            <div className="Not-success-payment-image">
              <img
                src="https://png.pngtree.com/png-clipart/20190115/ourlarge/pngtree-cartoon-hand-drawn-hand-drawn-kitten-expression-sad-png-image_345291.jpg"
                alt="Success"
              ></img>
            </div>
            <h5>Mua sắm không thành công</h5>
            <button className="Not-success-payment-button">
              <Link to={"/"} className="Not-link-sucess-payment">
                {" "}
                <p>quay lại trang chủ</p>
              </Link>
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
