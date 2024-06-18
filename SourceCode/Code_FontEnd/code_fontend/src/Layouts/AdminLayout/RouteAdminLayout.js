import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import FooterAdmin from "../../Components/Amind/FooterAdmin/FooterAdmin";
import HeaderAdmin from "../../Components/Amind/HeaderAdmin/HeaderAdmin";
import SideBarAdmin from "../../Components/Amind/SideBarAdmin/SideBarAdmin";
import "./RouteAdminLayout.css"
export default function RouteAdminLayout({ children }) {
  return (
    <>
      <HeaderAdmin />
      <div>
        <Row >
          <Col xl={2} className="body-sidebar-admin">
            <SideBarAdmin />
          </Col>
          <Col xl={10} className="body-layout-admin">
            {children}
            <FooterAdmin />
          </Col>
        </Row>
      </div>
    </>
  );
}
