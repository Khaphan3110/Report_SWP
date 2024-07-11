import * as request from "../../utility/CustomAxios";

export const createPromotion = async (promotinInfor) => {
    try {
      const res = await request.Post('Promotion',promotinInfor,{
          headers:{
              'Content-Type': 'application/json',
          }
      });
      return res;
    } catch (error) {
      console.log("Error create promotion", error);
    }
  };

export const updatePromotion = async (promotionID,promotionInfor) => {
    try {
      const res = await request.Put(`Promotion/${promotionID}`,promotionInfor,{
          headers:{
              'Content-Type': 'application/json',
          }
      });
      return res;
    } catch (error) {
      console.log("Error promotion update", error);
    }
  };

  export const deletePromotion = async (promotionID) => {
    try {
      const res = await request.Delete(`Promotion/${promotionID}`);
      return res;
    } catch (error) {
      console.log("Error promotion delete", error);
    }
  };

  //Promotion
  export const GetAllPromotion = async () => {
    try {
      const res = await request.Get(`Promotion`);
      return res;
    } catch (error) {
      console.log("Error promotion get all", error);
    }
  };