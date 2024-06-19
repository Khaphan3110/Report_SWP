import * as request from "../../utility/CustomAxios";
//Cate get all
export const createOrder = async (orđerInfor) => {
  try {
    const res = await request.Post(`Order/create`,orđerInfor,{
      headers:{
        'Content-Type': 'application/json',
      }
    });
    return res;
  } catch (error) {
    console.log("Error create order ", error);
  }
};