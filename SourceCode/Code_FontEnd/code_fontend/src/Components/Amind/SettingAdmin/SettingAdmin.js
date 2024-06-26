import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SettingAdmin.css';

const Setting = () => {
  return (
    <Container fluid className="settings">
      <Row>
        <Col md={2} className="sidebar-settings">
          <h2 className="text-center mt-3">MilkStore</h2>
          <ListGroup variant="flush">
            <ListGroup.Item as={Link} to="/dashboardadmin" className="text-white bg-dark">Dashboard</ListGroup.Item>
            <ListGroup.Item as={Link} to="/preorderadmin" className="text-white bg-dark">Preorder</ListGroup.Item>
            <ListGroup.Item as={Link} to="/settingadmin" className="text-white bg-dark">Settings</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={10} className="dashboard-content-settings">
          <SettingAdmin />
        </Col>
      </Row>
    </Container>
  );
};

const SettingAdmin = () => {
  const handleUpdate = (event) => {
    event.preventDefault();
    // Logic to handle update here
    console.log('Update button clicked');
  };
  return (
    <div className="settings__wrapper">
      <h2 className="settings__title">Settings</h2>

      <div className="settings__top">
        <button className="setting__btn">My Details</button>
        <button className="setting__btn active__btn">Profile</button>
        <button className="setting__btn">Password</button>
        <button className="setting__btn">Email</button>
        <button className="setting__btn">Notification</button>
      </div>

      <div className="details__form">
        <h2 className="profile__title">Profile</h2>
        <p className="profile__desc">
          Update your photo and personal details here
        </p>
        <form>
          <div className="form__group">
            <div>
              <label>Live in</label>
              <input type="text" placeholder="Sylhet, Bangladesh" />
            </div>

            <div>
              <label>Street</label>
              <input type="text" placeholder="SYL 3108" />
            </div>
          </div>

          <div className="form__group">
            <div>
              <label>Email</label>
              <input type="email" placeholder="example@gmail.com" />
            </div>

            <div>
              <label>Phone Number</label>
              <input type="number" placeholder="+880 17*******" />
            </div>
          </div>

          <div className="form__group">
            <div>
              <label>Date of Birth</label>
              <input type="date" placeholder="dd/mm/yyyy" />
            </div>

            <div>
              <label>Gender</label>
              <input type="text" placeholder="Male" />
            </div>
          </div>

           {/* Add single Update button at the end of form */}
           <button className="update__btn" onClick={handleUpdate}>Update</button>
        </form>
      </div>
    </div>
  );
}

export default Setting;
