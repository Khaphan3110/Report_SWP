import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AddressPage.css';
import AddressForm from './AddressForm';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([
    {
      lastName: 'Phan',
      firstName: 'Kha',
      phone: '0913676651',
      address: 'Vietnam',
      country: 'Vietnam',
      state: '',
      zip: '',
      defaultAddress: true,
    },
    {
      lastName: 'Phạm',
      firstName: 'Toàn',
      phone: '0931676651',
      address: 'vietnam, Hồ Chí Minh, Vietnam',
      country: 'Vietnam',
      state: 'Hồ Chí Minh',
      zip: '',
      defaultAddress: false,
    },
  ]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  const handleSaveAddress = (newAddress) => {
    if (currentAddress) {
      setAddresses(addresses.map(addr => addr === currentAddress ? newAddress : addr));
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
              <Card.Text>Xin chào, Phan Kha</Card.Text>
              <Card.Link as={Link} to="/account">Thông tin tài khoản</Card.Link>
              <Card.Link as={Link} to="/addresses">Số địa chỉ</Card.Link>
              <Link to={"/logout"}>Đăng xuất</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Header>ĐỊA CHỈ CỦA BẠN</Card.Header>
            <Card.Body>
              <Button variant="primary" className="mb-3" onClick={handleAddAddress}>Thêm địa chỉ</Button>
              {addresses.map((addr, index) => (
                <Row key={index} className="address-item mb-3">
                  <Col>
                    <Card.Text>
                      <strong>Họ tên:</strong> {addr.lastName} {addr.firstName} <br />
                      <strong>Địa chỉ:</strong> {addr.address} <br />
                      <strong>Số điện thoại:</strong> {addr.phone} <br />
                    </Card.Text>
                  </Col>
                  <Col md="auto" className="text-right">
                    <Button variant="link" onClick={() => handleEditAddress(addr)}>Chỉnh sửa địa chỉ</Button>
                    <Button variant="link" onClick={() => setAddresses(addresses.filter(a => a !== addr))}>Xóa</Button>
                  </Col>
                </Row>
              ))}
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
