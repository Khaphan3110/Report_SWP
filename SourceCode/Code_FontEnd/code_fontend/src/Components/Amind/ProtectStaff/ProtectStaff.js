import React, { useState } from "react";
import { useAdminProfile } from "../../../Store";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "./ProtectStaff.css";
export function ProtectStaff({ children, allowedRoles }) {
  const { StaffProfile } = useAdminProfile();

  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };
  if (!StaffProfile.profileAdmin) {
    return <Navigate to="/loginadmin" />;
  }
  if (allowedRoles && !allowedRoles.includes(StaffProfile.profileAdmin.role)) {
    return (
      <>
        <div className="require-accesst-to-page">
          <div className="Requrie-accesst-wrapper">
            <img
              src="https://png.pngtree.com/png-vector/20190916/ourlarge/pngtree-block-icon-for-your-project-png-image_1731069.jpg"
              alt="imageblock" width={500} height={500}
            />
            <h1>This page need Role to access</h1>
            <button className="button-require-access" onClick={handleClose}>
              <p>Return</p>
            </button>
          </div>
        </div>
      </>
    );
  }
  return children;
}
