import React, { useState } from "react";
import { MemberManagerContext } from "./Context";

export default function MemberManagerProvider({ children }) {
  const [listMember, setlistMember] = useState();

  
  return (
    <MemberManagerContext.Provider value={{ listMember, setlistMember }}>
      {children}
    </MemberManagerContext.Provider>
  );
}
