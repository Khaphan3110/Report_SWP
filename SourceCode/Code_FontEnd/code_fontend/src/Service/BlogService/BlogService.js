import * as request from "../../utility/CustomAxios";

export const createBlog = async (staffID,staffToken,blogContent) => {
  try {
    const res = await request.Post(`Admin/CreateBlog/${staffID}/createBlog`,blogContent,{
        headers:{
            'Authorization': `Bearer ${staffToken}`,
        }
    });
    return res;
  } catch (error) {
    console.log("Error create Blog", error);
  }
};

export const updateBlog = async (blogID,staffToken,blogContent) => {
    try {
      const res = await request.Put(`Admin/UpdateBlog/${blogID}/blog`,blogContent,{
          headers:{
              'Authorization': `Bearer ${staffToken}`,
              'Content-Type': 'application/json'
          }
      });
      return res;
    } catch (error) {
      console.log("Error update Blog", error);
    }
  };

  export const DeleteBlog = async (blogID,staffToken) => {
    try {
      const res = await request.Delete(`Admin/DeleteBlog/${blogID}/blog`,{
          headers:{
              'Authorization': `Bearer ${staffToken}`,
          }
      });
      return res;
    } catch (error) {
      console.log("Error delete Blog", error);
    }
  };

  export const GetAllBlog = async (staffToken) => {
    try {
      const res = await request.Get(`Admin/GetAllBlogs`,{
          headers:{
              'Authorization': `Bearer ${staffToken}`,
          }
      });
      return res;
    } catch (error) {
      console.log("Error getALL  Blog", error);
    }
  };

  
  export const GetblogPaging = async (pageIndex,pageSize) => {
    try {
      const res = await request.Get(`Admin/BlogPaging?PageIndex=${pageIndex}&PageSize=${pageSize}`);
      return res;
    } catch (error) {
      console.log("Error get paging  Blog", error);
    }
  };