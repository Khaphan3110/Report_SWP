import * as request from "../../utility/CustomAxios";
//Cate get all
export const createOrder = async (productID) => {
  try {
    const res = await request.Get(`Product/${productID}/images`);
    return res;
  } catch (error) {
    console.log("Error create order ", error);
  }
};