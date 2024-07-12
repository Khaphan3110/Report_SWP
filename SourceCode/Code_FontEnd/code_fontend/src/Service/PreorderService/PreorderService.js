import * as request from "../../utility/CustomAxios";
//Cate get all
export const checkProductIsReady = async (productID, quantity) => {
  try {
    const res = await request.Get(
      `PreOrder/availability?productId=${productID}&quantity=${quantity}`
    );
    return res;
  } catch (error) {
    console.log("Error check product is ready ", error);
  }
};

export const createPreOrder = async (productPreorder) => {
  try {
    const res = await request.Post(`PreOrder/create`, productPreorder, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.log("Error check product is ready ", error);
  }
};


//PreOrder/update-status
export const updateStatusPreorder = async (productPreorder,status) => {
    try {
      const res = await request.Put(`PreOrder/${productPreorder}/status?status=${status}`);
      return res;
    } catch (error) {
      console.log("Error update status prorder  ", error);
    }
  };

  export const PreorderDeposit = async (productPreorder) => {
    try {
      const res = await request.Post(`PreOrder/process-deposit`, productPreorder, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (error) {
      console.log("Error depossit preorder ", error);
    }
  };

  //PreOrder/CheckoutVNPayPreOrder
  export const VnpayCheckout = async (productPreorder) => {
    try {
      const res = await request.Post(`PreOrder/CheckoutVNPayPreOrder`, productPreorder, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (error) {
      console.log("Error checkout preorder ", error);
    }
  };

  export const PreorderPagingMember = async (memberID,pageIndex,pageSize) => {
    try {
      const res = await request.Get(`PreOrder/GetPreOrdersPaging?MemberId=${memberID}&PageIndex=${pageIndex}&PageSize=${pageSize}`);
      return res;
    } catch (error) {
      console.log("Error pagin member  preorder ", error);
    }
  };

  export const PreorderPagingMemberHistory = async (memberID,pageIndex,pageSize) => {
    try {
      const res = await request.Get(`PreOrder/GetPreOrdersHistoryPaging?MemberId=${memberID}&PageIndex=${pageIndex}&PageSize=${pageSize}`);
      return res;
    } catch (error) {
      console.log("Error pagin member  preorder history", error);
    }
  };