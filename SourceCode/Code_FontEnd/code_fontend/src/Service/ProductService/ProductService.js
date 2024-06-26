import * as request from "../../utility/CustomAxios";
//Cate get all
export const productGetAll = async () => {
  try {
    const res = await request.Get("Product");
    return res;
  } catch (error) {
    console.log("Error product get all", error);
  }
};

//Cate import
export const importProduct = async (Product) => {
  try {
    const res = await request.Post("Product/createmultiple", Product, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    console.log("Error Product import ", error);
  }
};

export const getProductByPinagine = async (pageIndex,PageSize) => {
  try {
    const res = await request.Get(`Product/public-paging?PageIndex=${pageIndex}&PageSize=${PageSize}`)
    return res;
  } catch (error) {
    console.log("Error getProduct by pageSize", error);
  }
}
