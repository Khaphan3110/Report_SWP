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
           'Content-Type': 'application/json',
        }
      });
      return res;
    } catch (error) {
      console.log("Error admin login", error);
    }
  };

//Admin/ConfirmEmail
export const AdminAuthenRegister = async (OTP) => {
  try {
    const res = await request.Get(`Admin/ConfirmEmail?otp=${OTP}`);
    return res;
  } catch (error) {
    console.log("Error authen register admin", error);
  }
};

//Admin/GetAdminByToken
export const GetAdminInforMation = async (TokenAdmin) => {
  try {
    const res = await request.Post(`Admin/GetAdminByToken`,TokenAdmin,{
      headers:{
        'Content-Type': 'application/json',
      }
    });
    return res;
  } catch (error) {
    console.log("Error authen register admin", error);
  }
};

export const SendEmailResetPasswordAdmin = async (Email) => {
  try {
    const res = await request.Put(`Admin/ResetAdminPassword?email=${Email}`);
    return res;
  } catch (error) {
    console.log("Error reset password admin", error);
  }
};

export const ResetPasswordAdmin = async (OTP,newPasswrord) => {
  try {
    const res = await request.Post(`Admin/ConfirmAdmin?otp=${OTP}`,newPasswrord,{
      headers:{
       ' Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    console.log("Error reset password admin", error);
  }
};

