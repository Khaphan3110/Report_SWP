import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountPage.css";
import { getUserInfor } from "../../../Service/UserService/UserService";
import { useUserProfile } from "../../../Store";

const AccountPage = () => {
  const navigator = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const location = useLocation();

  const {
    userProfile,
    setUserProfile,
    addCurrentAddress,
    getAllAdressByToken,
    updateUserToken,
    getUserProfileByToken,
  } = useUserProfile();
  // useEffect(() => {
  //   const resUser = async () => {
  //    await getUserProfileByToken(userProfile.userToken);
  //   };
  //   resUser();
  // }, []);
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


  const isEmpty = (obj) => {
    return Object.keys(obj).length !== 0;
  }

  return (
    <Container className="mt-5">
      <ToastContainer />
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>TRANG TÀI KHOẢN</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Xin chào, {userProfile.profile ? userProfile.profile.member.lastName : "Ho"}{" "}
                {userProfile.profile ? userProfile.profile.member.firstName : "ten"}!
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
                {userProfile.profile ? userProfile.profile.member.userName : "tai khoan"}
                <br />
                <strong>Địa chỉ: </strong> 
                {isEmpty(userProfile.CurrentAdress) ? (userProfile.CurrentAdress.house_Number +
                                "," +
                                userProfile.CurrentAdress.street_Name +
                                "," +
                                userProfile.CurrentAdress.district_Name +
                                "," +
                                userProfile.CurrentAdress.city +
                                "," +
                                userProfile.CurrentAdress.region) : (
                                <span style={{color:"red"}}>không có địa chỉ vui lòng thêm !!! <Link to={"/addresses"}>Đây</Link></span>)}
                <br />
                <strong>Điện thoại:</strong>{" "}
                {userProfile.profile ? userProfile.profile.member.phoneNumber : ""}
                <br />
              </Card.Text>
              <div style={{display:"flex",justifyContent:"space-between"}}>
              <h5 style={{alignContent:"center",margin:"0"}}>ĐƠN HÀNG CỦA BẠN</h5>
              <div>
                <button className="button-change-mode-tracking" >sản phẩm mua trước</button>
                <button className="button-change-mode-tracking" >lịch sử mua hàng</button>
              </div>
              </div>
              
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt</th>     
                    <th>TT vận chuyển</th>
                    <th>Thành tiền</th>
                    <th>Trạng thái đơn hàng</th>
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
