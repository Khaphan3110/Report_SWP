
import * as request from "../../utility/CustomAxios";
//Register user
export const userRegister = async (bodyInfor) => {
  try {
    const res = await request.Post("Users/register", bodyInfor, {
      headers: {
        "Content-Type": "multipart/form-data",    
      },
    });
    return res;
  } catch (error) {
    console.log("Error register", error);
  }
};

export const authenEmailRegister = async ( email ) => {
    try {
      const res = await request.Post(`Users/SendOTP?email=${email}`);
      return res;
    } catch (error) {
      console.log("lỗi send email",error);
    }
};

 
export const authenCodeOTP = async ( otp ) => {
  try {
    const res = await request.Post(`Users/ConfirmEmail?otp=${otp}`);
    return res;
  } catch (error) {
    console.log("lỗi authenOTP",error);
  }
};

export const userLogin = async ( UserLoginInfor ) => {
  
  try {
    const res = await request.Post("Users/authenticate", UserLoginInfor, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    })
    return res;
  } catch (error) {
    console.log("lỗi login",error);
  }
}

