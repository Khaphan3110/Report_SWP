import * as request from "../../utility/CustomAxios";
//Cate get all
export const imageGetAll = async (productID) => {
  try {
    const res = await request.Get(`Product/${productID}/images`);
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
        },
      }
    );
    return res;
  } catch (error) {
    console.log("Error Image import ", error);
  }
};
