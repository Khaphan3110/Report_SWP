import {
  ADD_LISTTO_CART,
  REMOVE_ITEM_CART,
  CLEAR_CART,
  TOTAL_PRICES,
  ADD_PRODUCT,
  ADD_IMAGE_TO_PRODUCT,
  DECREASE_QUANTITY_CART,
  INCREATE_QUANTITY_CART,
  ADD_TO_CART_WITH_MULTIPLE_QUANTITY,
  ADD_PROMOTION_VALUES,
  CALCULATETOTAL,
} from "./Constant";

export const addListToCart = (product, quantity) => ({
  type: ADD_LISTTO_CART,
  payload: { productadd: product, quantityadd: quantity },
});

export const removeProductToCart = (payload) => ({
  type: REMOVE_ITEM_CART,
  payload,
});

export const clearListToCart = () => ({
  type: CLEAR_CART,
});

export const totalPrice = () => ({
  type: TOTAL_PRICES,
});

export const addProduct = (payload) => ({
  type: ADD_PRODUCT,
  payload,
});

export const addImageToProduct = (payload) => ({
  type: ADD_IMAGE_TO_PRODUCT,
  payload,
});

export const increaseQuantity = (productid, quantity) => ({
  type: INCREATE_QUANTITY_CART,
  payload: { productid, quantity },
});

export const decreaseQuantity = (productId, qty) => ({
  type: DECREASE_QUANTITY_CART,
  payload: { productId, qty },
});

export const addtoCartMultiple = (payload) => ({
  type: ADD_TO_CART_WITH_MULTIPLE_QUANTITY,
  payload,
});

export const addPromotion = (promotionID,promotionValues) => ({
  type: ADD_PROMOTION_VALUES,
  payload:{promotionID,promotionValues}
});

export const calculateTotal = (payload) => ({
  type:  CALCULATETOTAL,
  payload,
});

//ADD_PROMOTION_VALUES