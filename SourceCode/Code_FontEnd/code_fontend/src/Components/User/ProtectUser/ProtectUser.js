import React, { useContext } from "react";
import { useUserProfile } from "../../../Store";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Store/ContextConfig/Context";

export function ProtectUser({ children }) {
  const { userProfile,getUserProfileByToken } = useUserProfile();
  console.log("day la login",userProfile.profile)
  if (!userProfile.profile.member) {
    return <Navigate to="/login" />;
  }
  return children;
}

export function ProtectAdmin({ children }) {
  const { userProfile } = useUserProfile();
  if (!userProfile.profile.member && userProfile.profile.role !== "admin") {
    return <Navigate to="/login" />;
  }
  return children;
}

export function ProtectStaff({ children }) {
  const { userProfile } = useUserProfile();
  if (!userProfile.profile.member && userProfile.profile.role !== "staff") {
    return <Navigate to="/login" />;
  }
  return children;
}
