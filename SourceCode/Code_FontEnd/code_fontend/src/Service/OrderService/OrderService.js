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