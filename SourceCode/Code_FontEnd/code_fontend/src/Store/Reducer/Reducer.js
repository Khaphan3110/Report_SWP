import { ADD_LISTTO_CART, REMOVE_ITEM_CART, CLEAR_CART } from "./Constant";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
};

function reducer(state, action) {
  switch (action.type) {
    case ADD_LISTTO_CART:
        const product = action.payload;
        const existingProduct = state.cartItems.find(item => item.productId === product.productId);
        const updatedCartAdd = existingProduct
          ? state.cartItems.map(item =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.cartItems, { ...product, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(updatedCartAdd));
        return {cartItems: updatedCartAdd };

    case REMOVE_ITEM_CART:
        const productDelete = action.payload;
        const updatedCartRemove = state.cartItems.filter(item => item.productId !== productDelete.productId);
        localStorage.setItem('cart', JSON.stringify(updatedCartRemove));
        return { cartItems: updatedCartRemove };

    case CLEAR_CART:
        localStorage.removeItem('cart')
        return {
            cartItems:[],
        }
    default:
        throw new Error("invalid action reducer")
    }
}

export { initialState };
export default reducer;
