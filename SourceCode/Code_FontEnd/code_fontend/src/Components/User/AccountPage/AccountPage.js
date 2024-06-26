import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountPage.css";
import { getUserInfor } from "../../../Service/UserService/UserService";
const AccountPage = () => {
  const navigator = useNavigate();
  const [userInfor, setUserInfor] = useState("");
  const [userToken, setuserToken] = useState(localStorage.getItem("userToken"));
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const location = useLocation();

  useEffect(() => {
    const resUser = async () => {
      const resUserInfor = await getUserInfor(userToken);
      if (resUserInfor) {
        setUserInfor(resUserInfor.data);
      }
    };
    resUser();
  }, []);

  const handleAddressModalClose = () => setShowAddressModal(false);
  const handleAddressModalShow = () => setShowAddressModal(true);

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    // Xử lý việc nhập địa chỉ tại đây
    alert(`Địa chỉ mới: ${address}`);
    handleAddressModalClose();
  };

  const handleLogout = () => {
    navigator("/logout");
  };

  return (
    <Container className="mt-5">
      <ToastContainer />
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>TRANG TÀI KHOẢN</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Xin chào, {userInfor && userInfor.member.lastName}{" "}
                {userInfor && userInfor.member.firstName}!
              </ListGroup.Item>
              <ListGroup.Item>
                {location.pathname === "/account" ? (
                  "Thông tin tài khoản"
                ) : (
                  <Link to="/account">Thông tin tài khoản</Link>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to="/addresses">Số địa chỉ</Link>{" "}
                {/* Use Link to navigate to addresses page */}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="link" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Header>TÀI KHOẢN</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Tên tài khoản:</strong>{" "}
                {userInfor && userInfor.member.userName}
                <br />
                <strong>Địa chỉ:</strong> , Vietnam
                <br />
                <strong>Điện thoại:</strong>{" "}
                {userInfor && userInfor.member.phoneNumber}
                <br />
              </Card.Text>
              <h5>ĐƠN HÀNG CỦA BẠN</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt</th>
                    <th>Thành tiền</th>
                    <th>TT thanh toán</th>
                    <th>TT vận chuyển</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="5">Không có đơn hàng nào.</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountPage;
