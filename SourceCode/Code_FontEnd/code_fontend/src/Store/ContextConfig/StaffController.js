import React, { useState } from "react";
import { StaffManagerContext } from "./Context";
import { getAllStaffPinagine } from "../../Service/StaffService/StaffService";

export default function StaffManagerProvider({ children }) {
  const [listStaff, setListStaff] = useState({
    items: [],
    totalRecords: 0,
    pageCount:0,
  });

  const getStaffPinagine = async (pageIndex, pageSize, bearerToken) => {
    try {
      const res = await getAllStaffPinagine(pageIndex, pageSize, bearerToken);
      if (res) {
        setListStaff((preState) => ({
          items: res.data.items,
          totalRecords: res.data.totalRecords,
          pageCount:res.data.pageCount
        }));
      }
    } catch (error) {
      console.log("lỗi get pinagine getStaff");
    }
  };

  return (
    <StaffManagerContext.Provider
      value={{ listStaff, setListStaff, getStaffPinagine }}
    >
      {children}
    </StaffManagerContext.Provider>
  );
}
