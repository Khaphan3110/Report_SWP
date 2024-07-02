import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CarStatsChart from '../Chart/CartStatsChart';
import MileChart from '../Chart/MileChart';
import TrackingChart from '../Chart/TrackingChart';
import './DashBoardAdmin.css';

// const Dashboard = () => {
//   return (
//     <Container fluid className="dashboard-container-new">
//       <Row>
//         <Col md={2} className="sidebar-new">
//           <h2 className="text-center mt-3">MilkStore</h2>
//           <ListGroup variant="flush">
//             <ListGroup.Item as={Link} to="/dashboardadmin" className="text-black-new bg-white">Dashboard</ListGroup.Item>
//             <ListGroup.Item as={Link} to="/preorderadmin" className="text-black-new bg-white">Preorder</ListGroup.Item>
//             <ListGroup.Item as={Link} to="/settingadmin" className="text-black-new bg-white">Settings</ListGroup.Item>
//           </ListGroup>
//         </Col>
//         <Col md={10} className="dashboard-content-new">
//           <DashboardContent />
//         </Col>
//       </Row>
//     </Container>
//   );
// };

const DashboardContent = () => (
  <div className="dashboard-content-new">
    <Row className="mt-2-new">
      <Col>
        <Card className="bg-primary text-white-new text-center">
          <Card.Body>
            <Card.Title>Total</Card.Title>
            <Card.Text>750+</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="bg-success text-white-new text-center">
          <Card.Body>
            <Card.Title>Daily sales</Card.Title>
            <Card.Text>1697+</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="bg-info text-white-new text-center">
          <Card.Body>
            <Card.Title>Clients Annually</Card.Title>
            <Card.Text>85k+</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="bg-secondary text-white-new text-center">
          <Card.Body>
            <Card.Title>Inventory</Card.Title>
            <Card.Text>2167+</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="mt-2-new">
      <Col>
        <Card className="card-new">
          <Card.Body>
            <Card.Title>Sales Statistics</Card.Title>
            <Card.Text>
              <MileChart />
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="card-new">
          <Card.Body>
            <Card.Title>Milk Statistics</Card.Title>
            <Card.Text>
              <CarStatsChart />
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="mt-2-new">
      <Col>
        <Card className="card-new">
          <Card.Body>
            <Card.Title>Tracking</Card.Title>
            <Card.Text>
              <TrackingChart />
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

export default DashboardContent;
