import * as request from "../../utility/CustomAxios";
export const cateGetAllNoPaginate = async () => {
  try {
    const res = await request.Get(`Category/GetAllCategory`);
    return res;
  } catch (error) {
    console.log("Error Cate get all no paginate", error);
  }
};

//Cate get all
export const cateGetAll = async (pageIndex,pageSize) => {
  try {
    const res = await request.Get(`Category/get-paging?PageIndex=${pageIndex}&PageSize=${pageSize}`);
    return res;
  } catch (error) {
    console.log("Error Cate get all", error);
  }
};

//Cate import
export const importCateGories = async (categories) => {
  try {
    const res = await request.Post("Category/CreateMultiple", categories, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.log("Error Cate import ", error);
  }
};

export const UpdateCategories = async (categoreisID,categories) => {
  try {
    const res = await request.Put(`Category/UpdateCategory/${categoreisID}/category`, categories, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.log("Error Cate update ", error);
  }
};

export const DeleteCategories = async (categoreisID) => {
  try {
    const res = await request.Delete(`Category/DeleteCategory/${categoreisID}/category`);
    return res;
  } catch (error) {
    console.log("Error Cate Delete ", error);
  }
};
