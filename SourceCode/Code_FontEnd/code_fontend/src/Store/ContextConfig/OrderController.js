import React, { useState } from "react";
import { OrderManagerContext } from "./Context";

export default function OrderManagerProvider({ children }) {
  const [listOrder, setListOrder] = useState();

  
  return (
    <OrderManagerContext.Provider value={{ listOrder, setListOrder }}>
      {children}
    </OrderManagerContext.Provider>
  );
}
