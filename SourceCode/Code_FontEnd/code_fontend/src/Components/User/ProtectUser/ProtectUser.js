import React, { useContext } from "react";
import { useUserProfile } from "../../../Store";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Store/ContextConfig/Context";

export function ProtectUser({ children }) {
  const { userProfile,getUserProfileByToken } = useUserProfile();
  if (!userProfile.profile.member) {
    return <Navigate to="/login" />;
  }
  return children;
}


