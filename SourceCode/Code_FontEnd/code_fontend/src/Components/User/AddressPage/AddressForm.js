import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddressForm = ({ show, handleClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    defaultAddress: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formLastName">
            <Form.Label>Họ</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formFirstName">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCountry">
            <Form.Label>Quốc gia</Form.Label>
            <Form.Control
              as="select"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">- Please Select -</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Hoa Kỳ">Hoa Kỳ</option>
              <option value="Vương quốc Anh">Vương Quốc Anh</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formDefaultAddress">
            <Form.Check
              type="checkbox"
              name="defaultAddress"
              label="Đặt là địa chỉ mặc định?"
              checked={formData.defaultAddress}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddressForm;
