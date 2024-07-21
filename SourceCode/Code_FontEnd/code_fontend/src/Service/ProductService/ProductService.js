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

export const UpdateProduct = async (productID,product) => {
  try {
    const res = await request.Put(`Product/${productID}`,product,{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })
    return res;
  } catch (error) {
    console.log("Error Update product", error);
  }
}

//Product/f
export const DeleteProduct = async (productID) => {
  try {
    const res = await request.Delete(`Product/${productID}`)
    return res;
  } catch (error) {
    console.log("Error delete product", error);
  }
}

export const getProductID = async (productID) => {
  try {
    const res = await request.Get(`Product/${productID}`)
    return res;
  } catch (error) {
    console.log("Error get product by id", error);
  }
}

//Product/ReviewPaging?Keyword=PM0724005&PageIndex=1&PageSize=5
export const getProductReviewPaging = async (productID,pageIndex,pageSize) => {
  try {
    const res = await request.Get(`Product/ReviewPaging?Keyword=${productID}&PageIndex=${pageIndex}&PageSize=${pageSize}`)
    return res;
  } catch (error) {
    console.log("Error get product by id paging", error);
  }
}