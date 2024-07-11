import * as request from "../../utility/CustomAxios";
//Register user
export const CreateReview = async (Token,reveiwInfor) => {
  try {
    const res = await request.Post(`Product/AddReview?jwtToken=${Token}`, reveiwInfor, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    console.log("Error create review", error);
  }
};

export const GetReviewProduct = async (productID) => {
    try {
      const res = await request.Get(`Product/GetReviewsByProductId?productId=${productID}`);
      return res;
    } catch (error) {
      console.log("Error get review", error);
    }
  };


  export const GetReviewMember = async (MemberID) => {
    try {
      const res = await request.Get(`Product/GetReviewsByMemberId?jwtToken=${MemberID}`);
      return res;
    } catch (error) {
      console.log("Error get review token", error);
    }
  };