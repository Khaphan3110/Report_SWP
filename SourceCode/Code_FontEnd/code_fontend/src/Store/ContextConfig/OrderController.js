import React, { useState } from "react";
import { OrderManagerContext } from "./Context";
import { GetOrderPiging, GetOrderPigingMember } from "../../Service/OrderService/OrderService";
import { getMemberID } from "../../Service/UserService/UserService";

export default function OrderManagerProvider({ children }) {
  const [listOrder, setListOrder] = useState([]);
  const [listHistoryOrder,setListHistoryOrder] = useState([])
  const [listCurrentOrder,setlistCurrentOrder] = useState([])
  const getOrderPagin = async (memberID,pageindex,pageSize) => {
    try {
      const resOrder = await GetOrderPigingMember(memberID,pageindex,pageSize);
      if(resOrder) {
        setListOrder(resOrder.data)
      } else {
        setListOrder([])
      }
      
    } catch (error) {
      console.log('lỗi ở getorder pagin controller', error)
    }
  }



  
  return (
    <OrderManagerContext.Provider value={{ listOrder, setListOrder,getOrderPagin,listHistoryOrder,setListHistoryOrder,listCurrentOrder,setlistCurrentOrder }}>
      {children}
    </OrderManagerContext.Provider>
  );
}
