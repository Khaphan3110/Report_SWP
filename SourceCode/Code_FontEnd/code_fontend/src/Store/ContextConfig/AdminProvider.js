import React, { useState } from "react";
import { AdminContext } from "./Context";
import { GetAdminInforMation } from "../../Service/AdminService/AdminService";
export default function AdminProvider({ children }) {
  const [StaffProfile, setStaffProfile] = useState({
    adminToken: localStorage.getItem("adminToken") || "",
    profileAdmin: JSON.parse(localStorage.getItem("adminProfile")) || {},
  });
  const updateAdminToken = (TokenAdmin) => {
    localStorage.setItem("adminToken", TokenAdmin); // Lưu token vào localStorage
    setStaffProfile((prevState) => ({
      ...prevState,
      adminToken: TokenAdmin,
    }));
  };

  const getAdminProfile = async (TokenAdmin) => {
    try {
      const res = await GetAdminInforMation(TokenAdmin);
      localStorage.setItem("adminProfile", JSON.stringify(res.data));
      if (res) {
        setStaffProfile((prevState) => ({
          ...prevState,
          profileAdmin: res.data,
        }));
      }
    } catch (error) {
      console.log("error at getadmin profile", error);
    }
  };

  const logoutAdmin = () => {
    localStorage.clear();
    setStaffProfile({
      adminToken: "",
      profileAdmin: {},
    });
  };

  return (
    <AdminContext.Provider
      value={{
        StaffProfile,
        setStaffProfile,
        updateAdminToken,
        getAdminProfile,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
