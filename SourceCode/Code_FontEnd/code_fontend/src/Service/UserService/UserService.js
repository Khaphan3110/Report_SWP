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

export const authenEmailForgotPassword = async ( emailForgot ) => {
  try {
    console.log(emailForgot.get("email"));
    const res = await request.Post("Users/ForgotPassword", emailForgot, {
      headers: {
        "Content-Type": "multipart/form-data",
         
      },
    });
    return res;
  } catch (error) {
    console.log("lỗi send email", error);
  }
};

export const authenCodeOTP = async (otp) => {
  try {
    console.log(otp);
    const res = await request.Get(`Users/ConfirmEmail?otp=${otp}`);
    return res;
  } catch (error) {
    console.log("lỗi authenOTP", error);
  }
};

export const userLogin = async (UserLoginInfor) => {
  try {
    const res = await request.Post("Users/authenticate", UserLoginInfor, {
      headers: {
       'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    console.log("lỗi login", error);
  }
};

export const userFogotPassword = async ( PasswordReset ) => {
  try {
    const res = await request.Post("Users/ResetPassword",PasswordReset, {
      headers:{
        'Content-Type': 'multipart/form-data',
      }
    })
    return res;
  } catch (error) {
    console.log("lỗi quên mật khẩu " + error)
  }
}

export const userLoginGoogle = async ( useGoogleLogin ) => {
  try {
    const res = await request.Post("Users/google-login",useGoogleLogin, {
      headers:{
        'Content-Type': 'application/json',
      }
    })
    return res;
  } catch (error) {
    console.log("lỗi đăng nhập google " + error)
  }
}

export const getUserInfor = async (TokenUser) => {

  try {
    const res = await request.Post("Users/GetMemberByToken",TokenUser,{
      headers:{
        'Content-Type': 'application/json'
      }
    })
    return res
  } catch (error) {
    console.log("lỗi lấy thông tin người dùng",error)
  }
  
}

export const userAddAdress = async (TokenUser,userAdress) => {

  try {
    const res = await request.Post(`Users/AddAddressByToken?jwtToken=${TokenUser}`,userAdress,{
      headers:{
        'Authorization': `Bearer ${TokenUser}`,
        'Content-Type': 'application/json',
      }
    })
    return res
  } catch (error) {
    console.log("lỗi nhập address  người dùng",error)
  }
  
}


export const getUserAddAdress = async (TokenUser) => {

  try {
    const res = await request.Get(`Users/GetAddressByToken?jwtToken=${TokenUser}`,{
      headers:{
        'Authorization': `Bearer ${TokenUser}`,
        'Content-Type': 'application/json',
      }
    })
    return res
  } catch (error) {
    console.log("lỗi lấy adress  người dùng",error)
  }
  
}

export const updateUserAdress = async (addressID,newAdress,TokenUser) => {
  try {
    const res = await request.Put(`Users/UpdateAddress/${addressID}/address`,newAdress,{
      headers:{
        'Authorization': `Bearer ${TokenUser}`,
        'Content-Type': 'application/json',
      }
    })
    return res
  } catch (error) {
    console.log("lỗi update adress  người dùng",error)
  }
  
}

export const deleteUserAddress = async (addressID,TokenUser) => {
  try {
    const res = await request.Delete(`Users/DeleteAddress/${addressID}/address`,{
      headers:{
        'Authorization': `Bearer ${TokenUser}`,
        'Content-Type': 'application/json',
      }
    })
    return res;
  } catch (error) {
    console.log("lỗi update address")
  }
}

export const updatePhoneNumberOfUser = async (TokenUser,userInfor) => {
  try {
    const res = await request.Put(`Users/UpdateMemberByToken?jwtToken=${TokenUser}`,userInfor,{
      headers:{
        'Authorization': `Bearer ${TokenUser}`,
        'Content-Type': 'application/json',
      }
    });
    return res;
  } catch (error) {
    console.log("lỗi update user phone or username",error)
  }
}

export const getMemberID = async (getMemberID) => {
  try {
    const res = await request.Get(`Users/GetMember/${getMemberID}`);
    return res;
  } catch (error) {
    console.log("lỗi update user phone or username",error)
  }
}


export const getMemberPaging = async (pageIndex,pageSize) => {
  try {
    const res = await request.Get(`Users/Paging?PageIndex=${pageIndex}&PageSize=${pageSize}`);
    return res;
  } catch (error) {
    console.log("lỗi get  paging Member",error)
  }
}

export const DeleteMember = async (MemberID,tokenAdmin) => {
  try {
    const res = await request.Delete(`Users/DeleteMember/${MemberID}`,{
      headers:{
        'Authorization': `Bearer ${tokenAdmin}`,
      }
    });
    return res;
  } catch (error) {
    console.log("lỗi Delete Member",error)
  }
}

export const GetAllMember = async (TokenUser) => {
  try {
    const res = await request.Get(`Users/GetAllMembers`,{
      headers:{
        'Authorization': `Bearer ${TokenUser}`,
      }
    });
    return res;
  } catch (error) {
    console.log("lỗi Delete Member",error)
  }
}
