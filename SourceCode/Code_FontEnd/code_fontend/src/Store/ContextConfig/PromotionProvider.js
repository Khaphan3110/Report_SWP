import React, { useEffect, useState } from "react";
import { PromotionManagerContext } from "./Context";
import { GetAllPromotion } from "../../Service/PromotionService/PromotionService";
export default function PromotionProvider({ children }) {
  const [listPromotion, setListPromotion] = useState(null);
  const getAllPromotion = async () => {
    try {
      const res = await GetAllPromotion();

      if (res) {
        // Sắp xếp theo thuộc tính `promotionId` giảm dần (với chuỗi)
        const sortedPromotions = res.data.sort((a, b) => {
          return b.promotionId.localeCompare(a.promotionId); // Giảm dần
        });
        setListPromotion(sortedPromotions);
      }
    } catch (error) {
      console.log("error at getall promotion", error);
    }
  };

  useEffect(() => {
    const res = async () => {
      await getAllPromotion();
    };
    res();
  }, []);
  return (
    <PromotionManagerContext.Provider
      value={{ listPromotion, setListPromotion, getAllPromotion }}
    >
      {children}
    </PromotionManagerContext.Provider>
  );
}
