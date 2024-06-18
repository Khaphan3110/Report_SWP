import * as request from "../../utility/CustomAxios";
//Cate get all
export const imageGetAll = async () => {
  try {
    const res = await request.Get("Product/PM0624001/images");
    return res;
  } catch (error) {
    console.log("Error product get all", error);
  }
};

//Cate import
export const importImageProduct = async (ProductID, image) => {
  try {
    const res = await request.Post(
      `Product/${ProductID}/uploadmultipleimages`,
      image,
      {
        headers: {
          "Content-Type": " multipart/form-data",
          'accept':'image/png'
        },
      }
    );
    return res;
  } catch (error) {
    console.log("Error Image import ", error);
  }
};
