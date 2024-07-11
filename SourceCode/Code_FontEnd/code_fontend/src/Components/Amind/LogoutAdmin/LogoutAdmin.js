import React from "react";
import { useAdminProfile } from "../../../Store";
import { Navigate, useNavigate } from "react-router-dom";

export default function LogoutAdmin() {
  const { StaffProfile, logoutAdmin } = useAdminProfile();
  logoutAdmin();
  return <Navigate to={"/loginadmin"}/>
}
