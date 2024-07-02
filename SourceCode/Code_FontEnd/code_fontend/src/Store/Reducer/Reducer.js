import { ADD_LISTTO_CART, REMOVE_ITEM_CART, CLEAR_CART } from "./Constant";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
  total: JSON.parse(localStorage.getItem("total")) || 0,
  statusAddTocart:JSON.parse(localStorage.getItem("statusAddTocart")) || false,
};

function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

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
        const newTotalAdd = calculateTotal(updatedCartAdd);
        localStorage.setItem('cart', JSON.stringify(updatedCartAdd));
        localStorage.setItem('total', JSON.stringify(newTotalAdd));
        localStorage.setItem("statusAddTocart",JSON.stringify(true))
        return {cartItems: updatedCartAdd,total: newTotalAdd };

    case REMOVE_ITEM_CART:
        const productDelete = action.payload;
        const updatedCartRemove = state.cartItems.filter(item => item.productId !== productDelete.productId);
        const newTotalRemove = calculateTotal(updatedCartRemove);
        localStorage.setItem('cart', JSON.stringify(updatedCartRemove));
        localStorage.setItem('total', JSON.stringify(newTotalRemove));
        return { cartItems: updatedCartRemove ,total: newTotalRemove};

    case CLEAR_CART:
        localStorage.removeItem('cart')
        localStorage.removeItem('total')
        return {
            cartItems:[], total: 0
        }
    default:
        throw new Error("invalid action reducer")
    }
}

export { initialState };
export default reducer;
