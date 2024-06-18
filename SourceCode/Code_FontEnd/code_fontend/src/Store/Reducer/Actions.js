import { ADD_LISTTO_CART, REMOVE_ITEM_CART, CLEAR_CART,TOTAL_PRICES } from "./Constant";

export const addListToCart = (payload) => ({
  type: ADD_LISTTO_CART,
  payload,
});

export const removeProductToCart = (payload) => ({
  type: REMOVE_ITEM_CART,
  payload,
});

export const clearListToCart = () => ({
  type: CLEAR_CART,
});

export const totalPrice = () => ({
    type:TOTAL_PRICES,
})
