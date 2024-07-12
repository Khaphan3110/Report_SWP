import * as request from "../../utility/CustomAxios";
export const UserRegisterAweek  = async (tokenAdmin) => {
  try {
    const res = await request.Get(`Admin/user-registrations-week`,{
      headers:{
        'Authorization': `Bearer ${tokenAdmin}`,
      }
    });
    return res;
  } catch (error) {
    console.log("Error user register a week", error);
  }
};

export const TotalAmountAweek  = async (tokenAdmin) => {
  try {
    const res = await request.Get(`Order/total-revenue-week`,{
      headers:{
        'Authorization': `Bearer ${tokenAdmin}`,
      }
    });
    return res;
  } catch (error) {
    console.log("Error total amount a week", error);
  }
};


export const TotalOrderAweek  = async (tokenAdmin) => {
  try {
    const res = await request.Get(`Order/total-orders-week`,{
      headers:{
        'Authorization': `Bearer ${tokenAdmin}`,
      }
    });
    return res;
  } catch (error) {
    console.log("Error total amount a week", error);
  }
};

//Product/get-total-product
export const TotalProduct  = async (tokenAdmin) => {
  try {
    const res = await request.Get(`Product/get-total-product`,{
      headers:{
        'Authorization': `Bearer ${tokenAdmin}`,
      }
    });
    return res;
  } catch (error) {
    console.log("Error total amount a week", error);
  }
};

//Users/GetTotalMember

export const TotalMeber  = async (tokenAdmin) => {
  try {
    const res = await request.Get(`Users/GetTotalMember`,{
      headers:{
        'Authorization': `Bearer ${tokenAdmin}`,
      }
    });
    return res;
  } catch (error) {
    console.log("Error total amount a week", error);
  }
};