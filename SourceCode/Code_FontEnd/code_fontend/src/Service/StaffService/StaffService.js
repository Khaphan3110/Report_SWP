import * as request from "../../utility/CustomAxios";

export const getAllStaffPinagine = async (pageIndex,pageSize,bearerToken) => {
    try {
      const res = await request.Get(`Users/StaffPaging?PageIndex=${pageIndex}&PageSize=${pageSize}&BearerToken=${bearerToken}`,{
          headers:{
            'Authorization': `Bearer ${bearerToken}`,
              'Content-Type': 'application/json',
          }
      });
      return res;
    } catch (error) {
      console.log("Error staff pinagine", error);
    }
  };

export const StaffRegister = async (listStaff,userToken) => {
  try {
    const res = await request.Post("Users/RegisterStaff",listStaff,{
        headers:{
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        }
    });
    return res;
  } catch (error) {
    console.log("Error staff register", error);
  }
};

export const deleteStaff = async (staffID) => {
    try {
      const res = await request.Delete(`Users/DeleteStaff?id=${staffID}`);
      return res;
    } catch (error) {
      console.log("Error delete staff register", error);
    }
  };