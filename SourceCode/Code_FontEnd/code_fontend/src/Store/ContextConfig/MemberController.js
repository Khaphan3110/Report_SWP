import React, { useState } from "react";
import { MemberManagerContext } from "./Context";
import { getMemberPaging } from "../../Service/UserService/UserService";

export default function MemberManagerProvider({ children }) {
  const [listMember, setlistMember] = useState({
    items: [],
    totalRecords: 0,
    pageCount: 0,
  });

  const getMemberPagingController = async (pageIndex, PageSize) => {
    try {
      const res = await getMemberPaging(pageIndex, PageSize);
      if (res) {
        setlistMember({
          items: res.data.items,
          totalRecords: res.data.totalRecords,
          pageCount: res.data.pageCount,
        })
      }
    } catch (error) {
      console.log("lỗi ở paging member", error)
    }
  }

  return (
    <MemberManagerContext.Provider value={{ listMember, setlistMember, getMemberPagingController }}>
      {children}
    </MemberManagerContext.Provider>
  );
}
