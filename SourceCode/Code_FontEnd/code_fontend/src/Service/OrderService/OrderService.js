import * as request from "../../utility/CustomAxios";
//Cate get all
export const createOrder = async (orderInfor) => {
  try {
    const res = await request.Post(`Order/create`, orderInfor, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.log("Error create order ", error);
  }
};

export const checkoutPay = async (userToken, order) => {
  try {
    const res = await request.Post(
      `Order/CheckoutVNPay?jwtToken=${userToken}`,
      order,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.log("Error checkout Vnpay ", error);
  }
};

export const paymentCallBack = async () => {
  try {
    const res = await request.Get("Order/PaymentCallBack");
    return res;
  } catch (error) {
    console.log("lỗi ở payment call back ", error);
  }
};

export const GetOrderPiging = async (pageIndex, pageSize) => {
  try {
    const res = await request.Get(
      `Order/GetOrdersPaging?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
    return res;
  } catch (error) {
    console.log("lỗi ở order paging ", error);
  }
};

export const GetOrderPigingMember = async (memberID, pageIndex, pageSize) => {
  try {
    const res = await request.Get(
      `Order/GetTrackingOrdersPaging?MemberId=${memberID}&PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
    return res;
  } catch (error) {
    console.log("lỗi ở order paging Member ", error);
  }
};

//Order/GetOrdersPaging?MemberId=MB0724001&PageIndex=1&PageSize=12
export const GetOrderPigingWithStatus = async (status, pageIndex, pageSize) => {
  try {
    const res = await request.Get(
      `Order/GetOrdersPaging?Status=${status}&PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
    return res;
  } catch (error) {
    console.log("lỗi ở order paging status ", error);
  }
};

export const getOrderById = async (memberToken) => {
  try {
    const res = await request.Get(`Order/member/${memberToken}`);
    return res;
  } catch (error) {
    console.log("Error create order ", error);
  }
};

export const updateStatusOrder = async (orderID, orderStatus) => {
  try {
    const res = await request.Put(
      `Order/${orderID}/status?status=${orderStatus}`
    );
    return res;
  } catch (error) {
    console.log("Error updateStatusOrder order ", error);
  }
};

//Order/cancel/fdsafs
export const CancelOrder = async (orderID) => {
  try {
    const res = await request.Put(`Order/cancel/${orderID}`);
    return res;
  } catch (error) {
    console.log("Error CancelOrder order ", error);
  }
};

export const GetOrderPigingMemberHistory = async (
  memberID,
  pageIndex,
  pageSize
) => {
  try {
    const res = await request.Get(
      `Order/GetOrdersHistoryPaging?MemberId=${memberID}&PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
    return res;
  } catch (error) {
    console.log("lỗi ở order paging Member history ", error);
  }
};

export const GetOrderPigingTrackingMember = async (
  memberID,
  pageIndex,
  pageSize
) => {
  try {
    const res = await request.Get(
      `Order/GetTrackingOrdersPaging?MemberId=${memberID}&PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
    return res;
  } catch (error) {
    console.log("lỗi ở order paging Member tracking ", error);
  }
};

export const OCDPayment = async (orderInfor,UserToken) => {
  try {
    const res = await request.Post(`Order/CheckoutCOD`,orderInfor,{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UserToken}`,
      }
    });
    return res;
  } catch (error) {
    console.log("lỗi ở order OCD payment ", error);
  }
};
