import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import FooterAdmin from "../../Components/Amind/FooterAdmin/FooterAdmin";
import HeaderAdmin from "../../Components/Amind/HeaderAdmin/HeaderAdmin";
import SideBarAdmin from "../../Components/Amind/SideBarAdmin/SideBarAdmin";

export default function RouteAdminLayout({ children }) {
  return (
    <>
      <HeaderAdmin />
      <div>
        <Row>
          <Col xl={2}>
            <SideBarAdmin />
          </Col>
          <Col xl={10}>{children}</Col>
        </Row>
      </div>
      <FooterAdmin />
    </>
  );
}
