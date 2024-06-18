import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AddressPage.css";
import AddressForm from "./AddressForm";
import {
  getUserAddAdress,
  getUserInfor,
} from "../../../Service/UserService/UserService";

const AddressPage = () => {
  const [userInfor, setUserInfor] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  useEffect(() => {
    const resUserAdress = async () => {
      const resAddress = await getUserAddAdress(userToken);
      if (resAddress) {
        setAddresses(resAddress.data);
      }
    };
    resUserAdress();
  }, []);

  useEffect(() => {
    const resUser = async () => {
      const resUserInfor = await getUserInfor(userToken);
      if (resUserInfor) {
        setUserInfor(resUserInfor.data);
      }
    };
    resUser();
  }, []);
  const handleSaveAddress = (newAddress) => {
    if (currentAddress) {
      setAddresses(
        addresses.map((addr) => (addr === currentAddress ? newAddress : addr))
      );
    } else {
      setAddresses([...addresses, newAddress]);
    }
    setIsFormVisible(false);
    setCurrentAddress(null);
  };

  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setIsFormVisible(true);
  };

  const handleAddAddress = () => {
    setCurrentAddress(null);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setCurrentAddress(null);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>TRANG TÀI KHOẢN</Card.Header>
            <Card.Body>
              <Card.Text>
                Xin chào, {userInfor && userInfor.member.lastName}{" "}
                {userInfor && userInfor.member.firstName}!
              </Card.Text>
              <Card.Link as={Link} to="/account">
                Thông tin tài khoản
              </Card.Link>
              <Card.Link as={Link} to="/addresses">
                Số địa chỉ
              </Card.Link>
              <Link to={"/logout"}>Đăng xuất</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Header>ĐỊA CHỈ CỦA BẠN</Card.Header>
            <Card.Body>
              <Button
                variant="primary"
                className="mb-3"
                onClick={handleAddAddress}
              >
                Thêm địa chỉ
              </Button>
              {/* { addresses && addresses.map((adress,index) => { */}
                  <Row className="address-item mb-3" >
                    <Col>
                      <Card.Text>
                        <strong>Họ tên:</strong>{" "}
                        {userInfor && userInfor.member.lastName}{" "}
                        {userInfor && userInfor.member.firstName} <br />
                        <strong>Địa chỉ:</strong>{" "}
                        {addresses &&
                          addresses.house_Number +
                            "," +
                            addresses.street_Name +
                            "," +
                            addresses.district_Name +
                            "," +
                            addresses.city +
                            "," +
                            addresses.region}{" "}
                        <br />
                        <strong>Số điện thoại:</strong>{" "}
                        {userInfor && userInfor.member.phoneNumber} <br />
                      </Card.Text>
                    </Col>
                    <Col md="auto" className="text-right">
                      <Button
                        variant="link"
                        // onClick={() => handleEditAddress(addr)}
                      >
                        Chỉnh sửa địa chỉ
                      </Button>
                      <Button
                        variant="link"
                        // onClick={() =>
                        //   // setAddresses(addresses.filter((a) => a !== addr))
                        // }
                      >
                        Xóa
                      </Button>
                    </Col>
                  </Row>;
                {/* })} */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AddressForm
        show={isFormVisible}
        handleClose={handleCloseForm}
        initialData={currentAddress}
        onSave={handleSaveAddress}
      />
    </Container>
  );
};

export default AddressPage;
