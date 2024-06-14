import * as request from "../../utility/CustomAxios";
//Cate get all
export const cateGetAll = async () => {
  try {
    const res = await request.Get("Category/GetAllCategory");
    return res;
  } catch (error) {
    console.log("Error Cate get all", error);
  }
};

//Cate import
export const importCateGories = async (categories) => {
    console.log(categories)
  try {
    const res = await request.Post("Category/CreateCategory", categories, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.log("Error Cate import ", error);
  }
};
