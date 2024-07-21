import React, { useState, createContext } from "react";
import {
  checkProductIsReady,
  createPreOrder,
  PreorderDeposit,
  VnpayCheckout,
} from "../../Service/PreorderService/PreorderService";

import { PreorderContext } from "./Context";

export default function PreorderProvider({ children }) {
  const [Preorder, setPreorder] = useState({
    preOrderProduct: JSON.parse(localStorage.getItem("preProduct")) || {},
    promotionPreorder: JSON.parse(
      localStorage.getItem("promotionPreOrder")
    ) || {
      promotionID: "PR0724001",
      promotionValues: 1,
    },
    totalPreOrder: JSON.parse(localStorage.getItem("totalPreOrder")) || 0,
  });
  const [listPreorder, setListPreOrder] = useState();
  const [listPreorderHistory, setlistPreorderHistory] = useState()
  const [listCurrentPreOrder, setlistCurrentPreOrder] = useState({})
  const [preOrderAgain, setPreorderAgain] = useState(JSON.parse(localStorage.getItem("PreorderAgain")) || {})

  const addPreorderAgain = (preOrder) => {
    try {
      const Preorder = {
        products:preOrder.product,
        preorderId: preOrder.preorderId,
        productId: preOrder.product.productId,
        memberId: preOrder.memberId,
        shippingAddress: preOrder.shippingAddress,
        quantity: preOrder.quantity,
        preorderDate: new Date().toISOString,
        total: Math.ceil(preOrder.price * (15/100)),
        totalAmountBefore:preOrder.price,
        status: preOrder.status
      }
      setPreorderAgain(Preorder)
      localStorage.setItem("PreorderAgain", JSON.stringify(Preorder));
    } catch (error) {
      console.log("error at add preOrder again", error)
    }
  }

  const addProductToPreorder = (productPreOrder, quantity) => {
    const newProduct = {
      categoriesId: productPreOrder.categoriesId,
      description: productPreOrder.description,
      images: productPreOrder.images,
      price: productPreOrder.price,
      productId: productPreOrder.productId,
      productName: productPreOrder.productName,
      quantity: quantity,
      statusDescription: productPreOrder.statusDescription,
    };
    setPreorder((prevState) => {
      const newTotalPreOrder = newProduct.price * quantity * (1 - 1 / 100);
      localStorage.setItem("preProduct", JSON.stringify(newProduct));
      localStorage.setItem("totalPreOrder", JSON.stringify(newTotalPreOrder));
      return {
        ...prevState,
        preOrderProduct: newProduct,
        totalPreOrder: newTotalPreOrder,
      };
    });
  };

  const addPromotion = (promotionID, promotionValues, productprice) => {
    if (Preorder.promotionPreorder.promotionID !== promotionID) {
      setPreorder((prevState) => {
        const total = productprice * (1 - promotionValues / 100);
        localStorage.setItem(
          "promotionPreOrder",
          JSON.stringify(promotionValues)
        );
        localStorage.setItem("totalPreOrder", JSON.stringify(total));
        return {
          ...prevState,
          promotionPreorder: {
            promotionID: promotionID,
            promotionValues: promotionValues,
          },
          totalPreOrder: total,
        };
      });
    }
  };

  const calculateTotal = () => {

    setPreorder((prevState) => {
      const { preOrderProduct, promotionPreorder } = prevState;
      const total =
        preOrderProduct.price * (1 - promotionPreorder.promotionValues / 100);
      return {
        ...prevState,
        totalPreOrder: total,
      };
    });
  };

  const clearProductPreorder = () => {
    localStorage.removeItem("preProduct")
    localStorage.removeItem("totalPreOrder")
    localStorage.removeItem("promotionPreOrder")
    setPreorder({
      preOrderProduct: {},
      promotionPreorder: {
        promotionID: "PR0724003",
        promotionValues: 1,
      },
      totalPreOrder: 0,
    });
  };

  return (
    <PreorderContext.Provider
      value={{
        Preorder,
        addProductToPreorder,
        clearProductPreorder,
        addPromotion,
        calculateTotal,
        listPreorder, setListPreOrder,
        listPreorderHistory, setlistPreorderHistory, listCurrentPreOrder, setlistCurrentPreOrder,addPreorderAgain,preOrderAgain, setPreorderAgain
      }}
    >
      {children}
    </PreorderContext.Provider>
  );
}
