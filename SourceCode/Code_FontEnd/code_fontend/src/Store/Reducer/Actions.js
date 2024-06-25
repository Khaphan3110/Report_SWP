import { ADD_LISTTO_CART, REMOVE_ITEM_CART, CLEAR_CART,TOTAL_PRICES,ADD_PRODUCT,ADD_IMAGE_TO_PRODUCT } from "./Constant";

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

export const addProduct = (payload) => ({
  type:ADD_PRODUCT,
  payload,
}) 

export const addImageToProduct = (payload) => ({
  type:ADD_IMAGE_TO_PRODUCT,
  payload,
}) 