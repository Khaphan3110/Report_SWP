import * as request from "../../utility/CustomAxios";
//Cate get all
export const createOrder = async (orderInfor) => {
  try {
    const res = await request.Post(`Order/create`,orderInfor,{
      headers:{
        'Content-Type': 'application/json',
      }
    });
    return res;
  } catch (error) {
    console.log("Error create order ", error);
  }
};

export const checkoutPay = async (userToken,order) => {
  try {
    const res = await request.Post(`Order/CheckoutVNPay?jwtToken=${userToken}`,order,{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      }
    });
    return res;
  } catch (error) {
    console.log("Error checkout Vnpay ", error);
  }
}

export const paymentCallBack = async () => {
  try {
    const res = await request.Get("Order/PaymentCallBack")
    return res;
  } catch (error) {
    console.log("lỗi ở payment call back ",error)
  }
}

export const GetOrderPiging = async () => {
  try {
    const res = await request.Get("Order/PaymentCallBack")
    return res;
  } catch (error) {
    console.log("lỗi ở payment call back ",error)
  }
}


export const getOrderById = async (memberToken) => {
  try {
    const res = await request.Get(`Order/member/${memberToken}`);
    return res;
  } catch (error) {
    console.log("Error create order ", error);
  }
};

export const updateStatusOrder = async (orderID) => {
  try {
    const res = await request.Put(`Order/${orderID}/status`);
    return res;
  } catch (error) {
    console.log("Error create order ", error);
  }
};

//Order/cancel/fdsafs
export const CancelOrder = async (orderID) => {
  try {
    const res = await request.Put(`Order/${orderID}/status`);
    return res;
  } catch (error) {
    console.log("Error create order ", error);
  }
};