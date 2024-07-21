import React, { useState } from "react";
import { OrderManagerContext } from "./Context";
import { GetOrderPiging, GetOrderPigingMember } from "../../Service/OrderService/OrderService";
import { getMemberID } from "../../Service/UserService/UserService";

export default function OrderManagerProvider({ children }) {
  const [listOrder, setListOrder] = useState([]);
  const [listHistoryOrder, setListHistoryOrder] = useState([])
  const [listCurrentOrder, setlistCurrentOrder] = useState([])
  const [orderAgain, setOrderAgain] = useState(JSON.parse(localStorage.getItem("OrderAgain")) || {})
  const getOrderPagin = async (memberID, pageindex, pageSize) => {
    try {
      const resOrder = await GetOrderPigingMember(memberID, pageindex, pageSize);
      if (resOrder) {
        setListOrder(resOrder.data)
      } else {
        setListOrder([])
      }

    } catch (error) {
      console.log('lỗi ở getorder pagin controller', error)
    }
  }

  const addOrderAgain = (order) => {
    try {
      const OrderAgain = {
        product: order.orderDetails,
        orderId: order.orderId,
        memberId: order.memberId,
        promotionId: order.promotionId,
        shippingAddress: order.shippingAddress,
        totalAmount: Math.ceil(order.totalAmount),
        orderStatus: order.orderStatus,
        orderDate: new Date().toISOString
      }
      setOrderAgain(OrderAgain)
      localStorage.setItem("OrderAgain", JSON.stringify(OrderAgain));
    } catch (error) {
      console.log("error order again!!!!")
    }
  }



  return (
    <OrderManagerContext.Provider value={{ listOrder, setListOrder, getOrderPagin, listHistoryOrder, setListHistoryOrder, listCurrentOrder, setlistCurrentOrder,addOrderAgain,orderAgain, setOrderAgain }}>
      {children}
    </OrderManagerContext.Provider>
  );
}
