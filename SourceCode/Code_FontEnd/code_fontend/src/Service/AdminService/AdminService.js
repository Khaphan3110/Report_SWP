import * as request from "../../utility/CustomAxios";

export const AdminRegister = async (adminInfor) => {
  try {
    const res = await request.Post("Admin/Register",adminInfor,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    });
    return res;
  } catch (error) {
    console.log("Error admin register", error);
  }
};

export const AdminLogin = async (adminInfor) => {
    try {
      const res = await request.Post("Admin/AuthenticateAdmin",adminInfor,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
      });
      return res;
    } catch (error) {
      console.log("Error admin login", error);
    }
  };