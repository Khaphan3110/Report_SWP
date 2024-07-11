import React, { useState } from "react";
import { OrderManagerContext } from "./Context";
import { GetOrderPiging } from "../../Service/OrderService/OrderService";
import { getMemberID } from "../../Service/UserService/UserService";

export default function OrderManagerProvider({ children }) {
  const [listOrder, setListOrder] = useState([]);

  const getOrderPagin = async (pageindex,pageSize) => {
    try {
      const resOrder = await GetOrderPiging(pageindex,pageSize);
      if(resOrder) {

        setListOrder(resOrder.data)
      }
      
    } catch (error) {
      console.log('lỗi ở getorder pagin controller', error)
    }
  }



  
  return (
    <OrderManagerContext.Provider value={{ listOrder, setListOrder,getOrderPagin }}>
      {children}
    </OrderManagerContext.Provider>
  );
}
