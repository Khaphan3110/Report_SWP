import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PreorderAdmin.css"; // Use the same CSS file for consistent styling

const PreorderAdmin = () => {
  return (
    <Container fluid className="container-settings">
      <Row>
        <Col md={2} className="sidebar-settings">
          <h2 className="text-center mt-3">MilkStore</h2>
          <ListGroup variant="flush">
            <ListGroup.Item as={Link} to="/dashboardadmin" className="text-black-new bg-white">Dashboard</ListGroup.Item>
            <ListGroup.Item as={Link} to="/preorderadmin" className="text-black-new bg-white">Preorder</ListGroup.Item>
            <ListGroup.Item as={Link} to="/settingadmin" className="text-black-new bg-white">Settings</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={10} className="dashboard-content-settings">
          <div className="products-wrapper">
            <h2 className="products-title">Available Products</h2>
            <div className="products-container">
              {/* Product items will be displayed here */}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PreorderAdmin;
