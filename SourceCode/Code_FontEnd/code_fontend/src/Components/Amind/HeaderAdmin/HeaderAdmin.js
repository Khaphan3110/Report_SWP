import React from "react";
import "./HeaderAdmin.css";
import { Col, Dropdown, Row } from "react-bootstrap";
import userIcon from "../../../assets/images/account-icon.png";
import { useAdminProfile } from "../../../Store";
import { Link, Navigate, useNavigate } from "react-router-dom";
export default function HeaderAdmin() {
  const { StaffProfile, logoutAdmin } = useAdminProfile();
  const navigator = useNavigate();
  const handLogoutAdmin = () => {
    logoutAdmin();
    navigator("/loginadmin");
  };
  return (
    <>
      <div>
        <Row className="navbar">
          <Col xl={2} className="logo-header-admin">
            <Link to={"/"}>
              <img
                src="https://theme.hstatic.net/1000186075/1000909086/14/logo.png?v=4468"
                alt="logo"
                width={248}
                height={53}
              />
            </Link>
          </Col>
          <Col xl={10} className="sub-header-admin">
            <div className="user-profile">
              <img src={userIcon} alt="userImage"></img>{" "}
              {StaffProfile.profileAdmin ? (
                <Dropdown>
                  <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
                    {StaffProfile.profileAdmin
                      ? StaffProfile.profileAdmin.fullName
                      : "Fullname"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {StaffProfile.profileAdmin.role === "staffadmin" ? (
                      <Dropdown.Item>
                        <Link
                          to={"/admin/settingadmin"}
                          className="nav-link-profile-admin-page"
                        >
                          Setting profile
                        </Link>
                      </Dropdown.Item>
                    ) : null}

                    <Dropdown.Item onClick={handLogoutAdmin}>
                      LogOut
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <h5>Sign In</h5>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
