import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import CarStatsChart from "../Chart/CartStatsChart";
import MileChart from "../Chart/MileChart";
import TrackingChart from "../Chart/TrackingChart";
import "./DashBoardAdmin.css";
import {
  TotalAmountAweek,
  TotalMeber,
  TotalOrderAweek,
  TotalProduct,
  UserRegisterAweek,
} from "../../../Service/Dashboard/Dashboard";
import { useAdminProfile } from "../../../Store/Hooks/Hooks";

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

export default function DashboardContent() {
  const { StaffProfile } = useAdminProfile();
  const [stateMoney, setstateMoney] = useState();
  const [stateRegisterAWeek, setstateRegisterAWeek] = useState();
  const [totalOrderAweek, settotalOrderAweek] = useState();
  const [ListTotalOrderAweek, setListTotalOrderAweek] = useState();
  const [totalProductSaled, settotalProductSaled] = useState();
  const [TotalMember, setTotalMember] = useState();
  const [listMoneyAWeek, setlistMoneyAWeek] = useState();

  const fetchData = async () => {
    try {
      const res = await TotalAmountAweek(StaffProfile.adminToken);
      if (res) {
        const revenueByDay = res.data.revenueByDay;
        const mileStaticsArray = Object.keys(revenueByDay).map((day) => {
          const dayMap = {
            Sunday: "Sun",
            Monday: "Mon",
            Tuesday: "Tue",
            Wednesday: "Wed",
            Thursday: "Thu",
            Friday: "Fri",
            Saturday: "Sat",
          };

          return {
            name: dayMap[day],
            saleStats: revenueByDay[day],
          };
        });
        setstateMoney(res.data.totalRevenueForWeek);
        setlistMoneyAWeek(mileStaticsArray);
      }
    } catch (error) {
      console.log("Error fetching total amount a week:", error);
    }
  };

  const resDataRegister = async () => {
    try {
      const res = await UserRegisterAweek(StaffProfile.adminToken);
      if (res) {
        const registrationsByDay = res.data.registrationsByDay;
        // Tạo một map để chuyển đổi các ngày trong tuần
        const dayMap = {
          Sunday: "Sun",
          Monday: "Mon",
          Tuesday: "Tue",
          Wednesday: "Wed",
          Thursday: "Thu",
          Friday: "Fri",
          Saturday: "Sat",
        };

        // Chuyển đổi registrationsByDay thành trackingData
        const trackingData = Object.keys(registrationsByDay).map((day) => ({
          name: dayMap[day],
          pv: registrationsByDay[day],
        }));

        setstateRegisterAWeek(trackingData);
      }
    } catch (error) {
      console.log("error register a week", error);
    }
  };

  const resDataOrder = async () => {
    try {
      const res = await TotalOrderAweek(StaffProfile.adminToken);
      if (res) {
        settotalOrderAweek(res.data.totalOrdersForWeek);
        const ordersByDay = res.data.ordersByDay;

        // Tạo một map để chuyển đổi các ngày trong tuần
        const dayMap = {
          Sunday: "Sun",
          Monday: "Mon",
          Tuesday: "Tue",
          Wednesday: "Wed",
          Thursday: "Thu",
          Friday: "Fri",
          Saturday: "Sat",
        };

        // Chuyển đổi ordersByDay thành carStaticsData
        const carStaticsData = Object.keys(ordersByDay).map((day) => ({
          name: dayMap[day],
          week: ordersByDay[day],
          prevWeek: Math.floor(Math.random() * 5000), // Ví dụ ngẫu nhiên cho prevWeek, bạn có thể thay đổi giá trị này theo yêu cầu
        }));

        setListTotalOrderAweek(carStaticsData);
      }
    } catch (error) {
      console.log("error order a week", error);
    }
  };

  const resDataProduct = async () => {
    try {
      const res = await TotalProduct(StaffProfile.adminToken);
      if (res) {
        settotalProductSaled(res.data);
      }
    } catch (error) {
      console.log("error product a week", error);
    }
  };

  const resDataMember = async () => {
    try {
      const res = await TotalMeber(StaffProfile.adminToken);
      if (res) {
        setTotalMember(res.data);
      }
    } catch (error) {
      console.log("error member a week", error);
    }
  };

  useEffect(() => {
    fetchData();
    resDataRegister();
    resDataOrder();
    resDataProduct();
    resDataMember();
  }, [StaffProfile.adminToken]);

  console.log("data", listMoneyAWeek);

  return (
    <div className="dashboard-content-new">
      <Row className="mt-2-new">
        <Col>
          <Card className="bg-primary text-white-new text-center">
            <Card.Body>
              <Card.Title>Total Money/w</Card.Title>
              <Card.Text>{Math.ceil(stateMoney).toLocaleString()} đ</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="bg-success text-white-new text-center">
            <Card.Body>
              <Card.Title>total Order/w</Card.Title>
              <Card.Text>{totalOrderAweek}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="bg-info text-white-new text-center">
            <Card.Body>
              <Card.Title>Clients Annually/w</Card.Title>
              <Card.Text>{TotalMember} +</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="bg-secondary text-white-new text-center">
            <Card.Body>
              <Card.Title>Product Saled/w</Card.Title>
              <Card.Text>{totalProductSaled} +</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-2-new">
        <Col>
          <Card className="card-new">
            <Card.Body>
              <Card.Title>Revenue/d</Card.Title>
              <Card.Text>
                <MileChart moneyAweek={listMoneyAWeek} />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="card-new">
            <Card.Body>
              <Card.Title>Order is created /d</Card.Title>
              <Card.Text>
                <CarStatsChart listOrderAWeek={ListTotalOrderAweek} />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-2-new">
        <Col>
          <Card className="card-new">
            <Card.Body>
              <Card.Title>New user</Card.Title>
              <Card.Text>
                <TrackingChart listRegisterAweek={stateRegisterAWeek} />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
