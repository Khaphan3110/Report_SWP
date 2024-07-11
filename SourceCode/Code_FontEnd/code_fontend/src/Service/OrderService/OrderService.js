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
export const GetOrderPigingWithStatus = async (
  status,
  memberID,
  pageIndex,
  pageSize
) => {
  try {
    const res = await request.Get(
      `Order/GetOrdersPaging?MemberId=${memberID}&Status=${status}&PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
    return res;
  } catch (error) {
    console.log("lỗi ở order paging complete ", error);
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
    const res = await request.Put(`Order/${orderID}/status`, orderStatus, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
